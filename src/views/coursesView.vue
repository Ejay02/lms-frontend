<script setup>
import { onMounted, ref } from "vue";
import { useCourseStore } from "../stores/course";
import LoadingSpinner from "../components/ui/LoadingSpinner.vue";
import Alert from "../components/ui/Alert.vue";

const courseStore = useCourseStore();
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    await courseStore.fetchCourses();
  } catch (err) {
    error.value = "Failed to load courses";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Available Courses</h1>

    <Alert v-if="error" type="error" :message="error" />

    <div v-if="loading" class="py-12">
      <LoadingSpinner size="lg" />
    </div>

    <div
      v-else-if="courseStore.courses.length"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="course in courseStore.courses"
        :key="course._id"
        class="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-2">{{ course.title }}</h2>
          <p class="text-gray-600 mb-4">{{ course.description }}</p>
          <RouterLink
            :to="`/courses/${course._id}`"
            class="text-blue-600 hover:underline"
          >
            View Course
          </RouterLink>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12 text-gray-600">
      No courses available
    </div>
  </div>
</template>
