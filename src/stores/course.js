import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import api from "../utils/axios";
import { useNotificationStore } from "./notification";

export const useCourseStore = defineStore("course", () => {
  const courses = ref([]);
  const currentCourse = ref(null);
  const progress = ref({});

  const enrolledCourseIds = ref(new Set());
  const loading = ref(false);
  // const token = ref(localStorage.getItem("token"));
  const notificationStore = useNotificationStore();

  const searchQuery = ref("");
  const searchQueryMyCourses = ref("");
  const page = ref(1);
  const limit = ref(10);

  // const setAuthHeader = (token) => {
  //   if (token) {
  //     api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  //   } else {
  //     delete api.defaults.headers.common["Authorization"];
  //   }
  // };

  // setAuthHeader(token.value);

  const fetchCourses = async () => {
    try {
      loading.value = true;

      const response = await api.get("/courses", {
        params: {
          page: page.value,
          limit: limit.value,
          search: searchQuery.value,
        },
      });

      // if (response?.data?.data) {
      // Update courses with the response data
      courses.value = response?.data?.data?.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ); // Sort by the latest added course first

      // Update enrolled course IDs based on isEnrolled flag from backend
      enrolledCourseIds.value = new Set(
        response.data.data
          .filter((course) => course.isEnrolled === true)
          .map((course) => course._id)
      );
      // }
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Watch for changes in searchQuery for general courses
  watch(searchQuery, async () => {
    fetchCourses();
  });

  const fetchMyCourses = async () => {
    try {
      loading.value = true;
      const response = await api.get("/courses/my-courses", {
        params: {
          page: page.value,
          limit: limit.value,
          search: searchQueryMyCourses.value,
        },
      });

      courses.value = response?.data?.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Watch for changes in searchQuery for my courses
  watch(searchQueryMyCourses, async () => {
    fetchMyCourses();
  });

  const enroll = async (course) => {
    try {
      if (!course?._id) {
        throw new Error("Invalid course data");
      }

      const response = await api.post(`/courses/${course._id}/enroll`, {
        courseId: course._id,
      });

      // Update the enrollment status in the courses list
      const courseIndex = courses.value.findIndex((c) => c._id === course._id);
      if (courseIndex !== -1) {
        courses.value[courseIndex] = {
          ...courses.value[courseIndex],
          isEnrolled: true,
        };
      }

      // Add to enrolled courses set
      enrolledCourseIds.value.add(course._id);

      await fetchCourses();

      notificationStore.addNotification({
        type: "success",
        message: `Successfully enrolled in ${course.title}!`,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const unenroll = async (course) => {
    try {
      if (!course?._id) {
        throw new Error("Invalid course data");
      }

      const response = await api.post(`/courses/${course._id}/unenroll`, {
        courseId: course._id,
      });

      // Update the local course data unconditionally.
      const courseIndex = courses.value.findIndex((c) => c._id === course._id);
      if (courseIndex !== -1) {
        courses.value[courseIndex] = {
          ...courses.value[courseIndex],
          isEnrolled: false,
        };
      }

      // Remove from enrolled courses set
      enrolledCourseIds.value.delete(course._id);

      await fetchMyCourses();

      notificationStore.addNotification({
        type: "success",
        message: `${course.title} unenrolled!`,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const isEnrolled = computed(() => (courseId) => {
    return (
      enrolledCourseIds.value.has(courseId) ||
      courses.value.find((c) => c._id === courseId)?.isEnrolled === true
    );
  });

  const fetchProgress = async (courseId) => {
    try {
      if (!courseId) {
        throw new Error("Course ID is required");
      }

      const response = await api.get(`/progress/${courseId}`);

      // Store both progress percentage and completed content
      progress.value[courseId] = {
        percentage: response.data.progress || 0,
        completedContent: response.data.completedContent || [],
        lastAccessed: response.data.lastAccessed,
        course: response.data.course,
      };

      return progress.value[courseId];
    } catch (error) {
      console.error("Error fetching progress:", error);
      // Initialize with default values if there's an error
      progress.value[courseId] = {
        percentage: 0,
        completedContent: [],
        lastAccessed: null,
        course: null,
      };
      throw error;
    }
  };

  const updateProgress = async (courseId, contentId) => {
    try {
      if (!courseId || !contentId) {
        throw new Error("Course ID and Content ID are required");
      }

      const response = await api.post(`/progress/${courseId}`, { contentId });

      // Update the local progress state with the new data
      progress.value[courseId] = {
        percentage: response.data.progress,
        completedContent: response.data.completedContent,
        lastAccessed: response.data.lastAccessed,
        course: response.data.course,
      };

      // Show success notification
      notificationStore.addNotification({
        type: "success",
        message: "Section Completed!",
      });

      return response.data;
    } catch (error) {
      console.error("Error updating progress:", error);
      notificationStore.addNotification({
        type: "error",
        message: "Failed to update progress. Please try again.",
      });
      throw error;
    }
  };

  return {
    enroll,
    courses,
    unenroll,
    progress,
    isEnrolled,
    searchQuery,
    fetchCourses,
    currentCourse,
    fetchProgress,
    fetchMyCourses,
    updateProgress,
    searchQueryMyCourses,
  };
});
