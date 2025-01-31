import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../utils/axios";
import { useNotificationStore } from "./notification";

export const useCourseStore = defineStore("course", () => {
  const courses = ref([]);
  const currentCourse = ref(null);
  const progress = ref({});
  const user = ref(null);
  const enrolledCourseIds = ref(new Set());
  const loading = ref(false);
  const token = ref(localStorage.getItem("token"));
  const notificationStore = useNotificationStore();

  const setAuthHeader = (token) => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  };

  setAuthHeader(token.value);

  const fetchCourses = async () => {
    try {
      loading.value = true;
      const response = await api.get("/courses");

      courses.value = response?.data?.data;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const fetchMyCourses = async () => {
    try {
      loading.value = true;
      const response = await api.get("/courses/my-courses");

      courses.value = response?.data?.data;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const enroll = async (course) => {
    try {
      if (!course?._id) {
        throw new Error("Invalid course data");
      }

      const response = await api.post(`/courses/${course._id}/enroll`, {
        courseId: course._id,
      });

      // Update the courses list with the new data
      if (response?.data?.data) {
        courses.value = response.data.data;
      }

      // Add the course ID to enrolled courses
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

  const isEnrolled = (courseId) => {
    return enrolledCourseIds.value.has(courseId);
  };

  const fetchProgress = async (courseId) => {
    try {
      const response = await api.get(`/progress/${courseId}`);
      progress.value[courseId] = response.data.progress;
    } catch (error) {
      progress.value[courseId] = 0; // Default to 0 if no progress found
    }
  };

  const updateProgress = async (courseId, contentId) => {
    try {
      await api.post(`/progress/${courseId}`, { contentId });
      await fetchProgress(courseId); // Refresh progress after updating
    } catch (error) {
      throw error;
    }
  };

  return {
    enroll,
    courses,
    progress,
    isEnrolled,
    fetchCourses,
    currentCourse,
    fetchProgress,
    fetchMyCourses,
    updateProgress,
  };
});
