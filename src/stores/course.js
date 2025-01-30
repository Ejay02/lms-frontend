import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useCourseStore = defineStore("course", () => {
  const courses = ref([]);
  const currentCourse = ref(null);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("/api/courses");
      courses.value = response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    courses,
    currentCourse,
    fetchCourses,
  };
});
