import { defineStore } from "pinia";
import { ref, watch } from "vue";
import api from "../utils/axios";
import { useNotificationStore } from "./notification";

export const useInstructorCoursesStore = defineStore(
  "instructorCourses",
  () => {
    const courses = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const search = ref("");

    const notificationStore = useNotificationStore();

    const fetchInstructorCourses = async ({
      page = 1,
      limit = 10,
      searchQuery = "",
    } = {}) => {
      loading.value = true;
      try {
        const response = await api.get("/courses/instructor-courses", {
          params: { page, limit, searchQuery },
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

    watch(search, async () => {
      fetchInstructorCourses();
    });

    const fetchSingleCourse = async (courseId) => {
      try {
        const { data } = await api.get(`/courses/${courseId}`);
        return data;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Error fetching course";
        notificationStore.addNotification({
          type: "error",
          message: errorMessage,
        });
        throw new Error(errorMessage);
      }
    };

    const deleteCourse = async (courseId) => {
      try {
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
        await fetchInstructorCourses();
      } catch (err) {
        error.value = err.response?.data?.message || "Failed to delete course";
        throw new Error(error.value);
      }
    };

    const createCourse = async (courseData) => {
      try {
        const { data } = await api.post("/courses", {
          title: courseData.title,
          description: courseData.description,
          coverImage: courseData.coverImage,
          content: courseData.content.map((item) => ({
            title: item.title.trim(),
            description: item.description?.trim(),
            type: item.type,
            data: item.data.trim(),
          })),
        });

        notificationStore.addNotification({
          type: "success",
          message: `Course created successfully`,
        });
        await fetchInstructorCourses();
        return data;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Error creating course";

        notificationStore.addNotification({
          type: "error",
          message: errorMessage,
        });

        error.value = errorMessage;
        throw new Error(errorMessage);
      }
    };

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

        await fetchInstructorCourses();
      } catch (err) {
        error.value = err.response?.data?.message || "Failed to update course";
        throw new Error(error.value);
      }
    };

    return {
      error,
      search,
      courses,
      loading,
      updateCourse,
      deleteCourse,
      createCourse,
      fetchSingleCourse,
      fetchInstructorCourses,
    };
  }
);

// TODO:
/**

 * 2: create Edit Course UI
 * 3. fix the login from instructor page
 * 4. create a view course page mark complete btn which up updates the course progress bar
 * 5. create a course completed certificate which should be sent when progress is 100%
 * 6. refactor code, clean up and move to individual components[if youve got the time?]
 * 7. update README.md
 */
