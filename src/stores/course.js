import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import api from "../utils/axios";
import { useNotificationStore } from "./notification";
import { useAuthStore } from "./auth";

export const useCourseStore = defineStore("course", () => {
  const courses = ref([]);
  const currentCourse = ref(null);
  const progress = ref({});

  const enrolledCourseIds = ref(new Set());
  const loading = ref(false);

  const notificationStore = useNotificationStore();
  const authStore = useAuthStore();

  const searchQuery = ref("");
  const searchQueryMyCourses = ref("");
  const page = ref(1);
  const limit = ref(10);



  const fetchCourses = async () => {
    try {
      loading.value = true;
      const [coursesResponse, enrolledResponse] = await Promise.all([
        api.get("/courses", {
          params: {
            page: page.value,
            limit: limit.value,
            search: searchQuery.value,
          },
        }),
        api.get("/courses/my-courses"), // Fetch enrolled courses separately
      ]);

      // Get all courses and sort them
      const sortedCourses = coursesResponse?.data?.data?.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Get enrolled course IDs from my-courses endpoint
      const myEnrolledCourses = enrolledResponse?.data?.data || [];
      const enrolledIds = new Set(
        myEnrolledCourses.map((course) => course._id)
      );

      // Update the enrolledCourseIds set
      enrolledCourseIds.value = enrolledIds;

      // Update courses with correct enrollment status
      courses.value = sortedCourses.map((course) => ({
        ...course,
        isEnrolled: enrolledIds.has(course._id),
        students: course.students || [],
      }));
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

      // Update the local state
      const courseIndex = courses.value.findIndex((c) => c._id === course._id);
      if (courseIndex !== -1) {
        courses.value[courseIndex] = {
          ...courses.value[courseIndex],
          isEnrolled: true,
          students: [
            ...(courses.value[courseIndex].students || []),
            authStore.user,
          ],
        };
      }

      // Add to enrolled courses set
      enrolledCourseIds.value.add(course._id);

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

      // Update the local state
      const courseIndex = courses.value.findIndex((c) => c._id === course._id);
      if (courseIndex !== -1) {
        courses.value[courseIndex] = {
          ...courses.value[courseIndex],
          isEnrolled: false,
          students:
            courses.value[courseIndex].students?.filter(
              (student) => student._id !== authStore.user?._id
            ) || [],
        };
      }

      // Remove from enrolled courses set
      enrolledCourseIds.value.delete(course._id);

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
    return enrolledCourseIds.value.has(courseId);
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
