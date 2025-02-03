<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white p-4 rounded-lg shadow-lg w-96">
      <h2 class="text-lg font-semibold mb-3">Leave Feedback</h2>

      <StarRating v-model:rating="rating" class="mb-3" />

      <textarea
        v-model="comment"
        placeholder="✨ Leave a comment..."
        class="w-full border p-2 rounded-md focus:ring-0 focus:outline-none text-gray-700 resize-none"
        rows="2"
      ></textarea>

      <div class="flex justify-end space-x-2 mt-4">
        <button @click="closeModal" class="px-4 py-2 bg-gray-300 rounded-md">
          Cancel
        </button>
        <button
          @click="submitFeedback"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          :disabled="!comment.trim() || !rating || isSubmitting"
        >
          {{ isSubmitting ? "Posting..." : "Post" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from "../../utils/axios";
import StarRating from "../starRating.vue";
import { ref, defineEmits } from "vue";
import { useNotificationStore } from "../../stores/notification";

const props = defineProps({
  isOpen: Boolean,
  courseId: String,
});

const emit = defineEmits(["close"]);

const comment = ref("");
const rating = ref(0);
const isSubmitting = ref(false);
const notificationStore = useNotificationStore();

const closeModal = () => {
  emit("close");
  comment.value = "";
  rating.value = 0;
};

const submitFeedback = async () => {
  if (!comment.value.trim() || !rating.value) return;

  try {
    isSubmitting.value = true;

    const response = await api.post(
      `/feedback/${props.courseId}`,
      { rating: rating.value, comment: comment.value },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    notificationStore.addNotification({
      type: "success",
      message: `Feedback submitted successfully!`,
    });

    comment.value = "";
    rating.value = 0;
    closeModal();
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: `Error submitting feedback`,
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>
