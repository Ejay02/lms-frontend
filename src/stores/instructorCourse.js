import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../utils/axios";
import { useNotificationStore } from "./notification";

export const useInstructorCoursesStore = defineStore(
  "instructorCourses",
  () => {
    const courses = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const notificationStore = useNotificationStore();

    const fetchInstructorCourses = async ({
      page = 1,
      limit = 10,
      search = "",
    } = {}) => {
      loading.value = true;
      try {
        const response = await api.get("/courses/instructor-courses", {
          params: { page, limit, search },
        });

        courses.value = response?.data?.data;
      } catch (err) {
        error.value =
          err.response?.data?.message || "Failed to fetch instructor courses";
        throw new Error(error.value);
      } finally {
        loading.value = false;
      }
    };

    // Update a specific course
    const updateCourse = async (courseId, updatedData) => {
      try {
        const { data } = await api.put(`/courses/${courseId}`, updatedData);
        courses.value = courses.value.map((course) =>
          course._id === courseId ? { ...course, ...data } : course
        );
        notificationStore.addNotification({
          type: "success",
          message: `Successfully updated the course!`,
        });
      } catch (err) {
        error.value = err.response?.data?.message || "Failed to update course";
        throw new Error(error.value);
      }
    };

    // Delete a specific course
    const deleteCourse = async (courseId) => {
      try {
        // Optionally get course title for notification
        const courseToDelete = courses.value.find(
          (course) => course._id === courseId
        );
        await api.delete(`/courses/${courseId}`);
        courses.value = courses.value.filter(
          (course) => course._id !== courseId
        );
        notificationStore.addNotification({
          type: "success",
          message: `Successfully deleted ${
            courseToDelete?.title || "the course"
          }!`,
        });
      } catch (err) {
        error.value = err.response?.data?.message || "Failed to delete course";
        throw new Error(error.value);
      }
    };

    return {
      courses,
      loading,
      error,
      updateCourse,
      deleteCourse,
      fetchInstructorCourses,
    };
  }
);
