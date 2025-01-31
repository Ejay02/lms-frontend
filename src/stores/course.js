import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../utils/axios";

export const useCourseStore = defineStore("course", () => {
  const courses = ref([]);
  const currentCourse = ref(null);
  const progress = ref({});
  const user = ref(null);
  const token = ref(localStorage.getItem("token"));

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
      const response = await api.get("/courses");
      console.log("response:", response);
      courses.value = response?.data?.data;
    } catch (error) {
      throw error;
    }
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
    courses,
    progress,
    currentCourse,
    fetchCourses,
    fetchProgress,
    updateProgress,
  };
});
