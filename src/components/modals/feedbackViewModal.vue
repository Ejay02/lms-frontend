<template>
  <div
    v-if="props.show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Course Feedback</h2>
        <button @click="handleClose" class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <Alert v-if="error" type="error" :message="error" />

      <EmptyState
        v-if="!loading && feedback.length === 0"
        icon="fa-solid fa-hourglass-start"
        heading="No feedback available"
        description="No feedback available for this course yet."
      />

      <div v-if="loading" class="py-12 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>

      <div v-else class="max-h-96 overflow-y-auto">
        <div
          v-for="item in feedback"
          :key="item._id"
          class="mb-4 p-4 border rounded-lg"
        >
          <div class="flex items-center mb-2">
            <i class="fas fa-user-circle text-gray-400 mr-2"></i>
            <span class="font-semibold">{{ item.user.name }}</span>
          </div>
          <p class="text-gray-600">{{ item.comment }}</p>
          <span class="text-sm text-gray-400">
            {{ new Date(item.createdAt).toLocaleDateString("en-CA") }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import api from "../../utils/axios";
import LoadingSpinner from "../ui/LoadingSpinner.vue";
import EmptyState from "../ui/emptyState.vue";
import Alert from "../ui/Alert.vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  course: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);
const feedback = ref([]);
const loading = ref(true);

const handleClose = () => {
  emit("close");
};

const getFeedback = async () => {
  if (!props.course?._id) return;

  loading.value = true;
  try {
    const response = await api.get(`/feedback/${props.course._id}`);
    feedback.value = response.data?.data || [];
  } catch (error) {
    console.error("Error fetching feedback:", error);
  } finally {
    loading.value = false;
  }
};

// Watch for changes in course prop
watch(
  () => props.course,
  async (newCourse) => {
    if (newCourse && props.show) {
      await getFeedback();
    }
  },
  { immediate: true }
);
</script>
