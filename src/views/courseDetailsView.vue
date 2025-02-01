<!-- <script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useCourseStore } from "../stores/course";
import LoadingSpinner from "../components/ui/LoadingSpinner.vue";
import Alert from "../components/ui/Alert.vue";

const route = useRoute();
const courseStore = useCourseStore();
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    await courseStore.fetchCourseById(route.params.id);
  } catch (err) {
    error.value = "Failed to load course details";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <Alert v-if="error" type="error" :message="error" />

    <div v-if="loading" class="py-12">
      <LoadingSpinner size="lg" />
    </div>

    <div v-else-if="courseStore.currentCourse" class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">
        {{ courseStore.currentCourse.title }}
      </h1>

      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Course Description</h2>
        <p class="text-gray-600">{{ courseStore.currentCourse.description }}</p>
      </div>

      <div class="space-y-4">
        <div
          v-for="(content, index) in courseStore.currentCourse.content"
          :key="index"
          class="bg-white rounded-lg shadow-md p-6"
        >
          <h3 class="text-lg font-semibold mb-2">{{ content.title }}</h3>
          <p class="text-gray-600">{{ content.description }}</p>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12 text-gray-600">Course not found</div>
  </div>
</template> -->
