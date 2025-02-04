<template>
  <div
    v-if="props.show"
    class="fixed inset-0 bg-white/50 bg-opacity-30 backdrop-blur-lg flex items-center justify-center cursor-pointer"
  >
    <div class="bg-gray-200 rounded-lg p-6 max-w-2xl w-full mx-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Course Feedback</h2>
        <button @click="handleClose" class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times cursor-pointer"></i>
        </button>
      </div>

      <!-- <Alert v-if="error" type="error" :message="error" /> -->

      <EmptyState
        v-if="!loading && feedback.length === 0"
        icon="fa-solid fa-hourglass-start"
        heading="No feedback available"
        description="No feedback available for this course yet."
      />

      <div v-if="loading" class="py-12 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>

      <div v-else class="max-h-96 overflow-y-auto space-y-6 p-4">
        <div
          v-for="item in feedback"
          :key="item._id"
          class="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div class="flex items-start gap-4">
            <!-- Avatar -->
            <img
              class="h-10 w-10 rounded-full object-cover flex-shrink-0"
              :src="
                item.user?.profileImage ||
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
              "
              :alt="`${item.user?.name}'s profile`"
            />

            <!-- Content Container -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4">
                <div class="space-y-1">
                  <h3 class="text-sm font-semibold text-gray-900 capitalize">
                    {{ item.user?.name }}
                  </h3>
                  <p class="text-xs text-gray-500">{{ item.user?.email }}</p>
                </div>

                <!-- Rating and Date -->
                <div class="flex items-center gap-3">
                  <StarRating :rating="item.rating" />
                  <span
                    class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                  >
                    {{ new Date(item.createdAt).toLocaleDateString("en-CA") }}
                  </span>
                </div>
              </div>

              <!-- Comment -->
              <p class="mt-4 text-sm text-gray-600 font-mono">
                {{ item.comment }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import api from "../../utils/axios";
import StarRating from "../starRating.vue";
import EmptyState from "../ui/emptyState.vue";
import LoadingSpinner from "../ui/loadingSpinner.vue";
import { useNotificationStore } from "../../stores/notification";

const notificationStore = useNotificationStore();

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

    feedback.value = response.data;
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: `Error getting feedback`,
    });
    throw new Error(error);
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
