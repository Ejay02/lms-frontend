<template>
  <div
    v-if="showFeedback"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Course Feedback</h2>
        <button
          @click="showFeedback = false"
          class="text-gray-500 hover:text-gray-700"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="max-h-96 overflow-y-auto">
        <div
          v-for="item in currentFeedback"
          :key="item._id"
          class="mb-4 p-4 border rounded-lg"
        >
          <div class="flex items-center mb-2">
            <i class="fas fa-user-circle text-gray-400 mr-2"></i>
            <span class="font-semibold">{{ item.user.name }}</span>
          </div>
          <p class="text-gray-600">{{ item.content }}</p>
          <span class="text-sm text-gray-400">{{ item.createdAt }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const showFeedback = ref(false);

</script>

<style scoped></style>
