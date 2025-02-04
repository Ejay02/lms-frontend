<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import { useCourseStore } from "../stores/course";
import LoadingSpinner from "../components/ui/loadingSpinner.vue";
import Alert from "../components/ui/alert.vue";
import EmptyState from "../components/ui/emptyState.vue";
import { useRouter } from "vue-router";
import StarRating from "../components/starRating.vue";
import FeedbackModal from "../components/modals/feedbackModal.vue";
import { useNotificationStore } from "../stores/notification";

const router = useRouter();
const courseStore = useCourseStore();
const notificationStore = useNotificationStore();
const loading = ref(true);
const error = ref("");
const activeDropdowns = ref({});
const rating = ref(0);

const showFeedbackModal = ref(false);
const selectedCourseId = ref(null);

// Define dropdown items
const dropdownItems = [
  {
    icon: "far fa-heart",
    label: "Add to Wishlist",
    action: () => {
      notificationStore.addNotification({
        type: "info",
        message: `Demo: Added to wishlist !`,
      });
    },
  },
  {
    icon: "far fa-share-square",
    label: "Share",
    action: () => {
      notificationStore.addNotification({
        type: "warning",
        message: `Demo: Shared!`,
      });
    },
  },
  {
    icon: "far fa-flag",
    label: "Report",
    action: () => {
      notificationStore.addNotification({
        type: "warning",
        message: `Demo: Reported!`,
      });
    },
  },
  {
    icon: "far fa-message",
    label: "Feedback",
    action: (courseId) => {
      selectedCourseId.value = courseId;
      showFeedbackModal.value = true;
      activeDropdowns.value = {};
    },
  },
];

// Toggle dropdown
const toggleDropdown = (courseId, event) => {
  event.stopPropagation();
  activeDropdowns.value[courseId] = !activeDropdowns.value[courseId];
};

// Close all dropdowns
const closeAllDropdowns = (event) => {
  if (
    !event.target.closest(".dropdown-menu") &&
    !event.target.closest(".dropdown-toggle")
  ) {
    activeDropdowns.value = {};
  }
};

// Setup global click handler to close dropdowns
onMounted(async () => {
  document.addEventListener("click", closeAllDropdowns);
  try {
    await courseStore.fetchMyCourses();
  } catch (err) {
    error.value = "Failed to load courses";
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  document.removeEventListener("click", closeAllDropdowns);
});

// Helper to get progress for a course
const getCourseProgress = (courseId) => {
  return courseStore.progress[courseId] || 0;
};

const goToCourses = () => {
  router.push("/");
};

const handleUnenroll = async (course) => {
  try {
    await courseStore.unenroll(course);
  } catch (error) {
    console.error("Error enrolling:", error);
  }
};

const goToCourse = (course) => {
  router.push(`/my-course/${course._id}`);
};
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto bg-gray-200 rounded-md cursor-pointer">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-center">My Learning</h1>
      <div class="flex items-center border rounded-md">
        <i class="fa-solid fa-magnifying-glass px-4 text-gray-500"></i>
        <input
          v-model="courseStore.searchQueryMyCourses"
          type="text"
          placeholder="Search my courses..."
          class="px-4 py-2 border-0 outline-none text-sm"
        />
      </div>
    </div>

    <Alert v-if="error" type="error" :message="error" />

    <EmptyState
      v-if="!loading && courseStore.courses.length === 0"
      icon="fa-regular fa-calendar-check"
      heading="Nothing here yet!"
      description="Add Courses to get started"
      buttonText="Browse Courses"
      :buttonAction="goToCourses"
    />

    <div v-if="loading" class="py-12 flex justify-center">
      <LoadingSpinner size="lg" />
    </div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <div
        v-for="course in courseStore.courses"
        :key="course._id"
        class="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300 group relative"
      >
        <div class="relative">
          <img
            :src="course?.coverImage"
            class="w-full aspect-video object-cover"
            alt="Course Image"
          />
          <!-- Play Button Overlay -->
          <div
            class="absolute inset-0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center"
          >
            <div
              @click="() => goToCourse(course)"
              class="w-16 h-16 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <i class="fas fa-play text-gray-800 text-lg"></i>
            </div>
          </div>

          <!-- Progress Bar -->
          <div
            class="absolute bottom-0 left-0 right-0 bg-gray-900/70 text-white text-xs p-1"
          >
            <div class="flex items-center justify-between px-2">
              <span
                >{{
                  Math.floor(getCourseProgress(course._id).percentage) || 0
                }}
                % complete</span
              >
              <div class="w-24 bg-gray-200 rounded-full h-1.5">
                <div
                  class="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                  :style="{
                    width: `${getCourseProgress(course._id).percentage || 0}%`,
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Course Content -->
        <div class="p-4">
          <div class="flex justify-between items-start">
            <h2 class="font-bold text-base mb-1 line-clamp-2 flex-1">
              {{ course.title }}
            </h2>
            <!-- Dropdown Menu -->
            <div class="relative ml-2">
              <button
                @click="(e) => toggleDropdown(course._id, e)"
                class="p-1 hover:bg-gray-100 rounded cursor-pointer"
              >
                <i class="fas fa-ellipsis-v text-gray-500"></i>
              </button>
              <!-- Dropdown Content -->
              <div
                v-if="activeDropdowns[course._id]"
                class="cursor-pointer absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10 border border-gray-200 dropdown-menu"
                @click.stop
              >
                <div class="py-1">
                  <button
                    v-for="(item, index) in dropdownItems"
                    :key="index"
                    @click="item.action(course._id)"
                    class="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <i :class="item.icon" class="mr-2"></i>
                    {{ item.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="justify-between flex">
            <p class="text-sm text-gray-500 mb-1 capitalize">
              {{ course?.instructor?.name }}
            </p>

            <!-- Rating -->

            <div class="">
              <div class="flex items-center mb-1">
                <StarRating v-model:rating="rating" />
              </div>
              <div class="text-xs text-gray-500 text-center">Rate course</div>
            </div>
          </div>

          <!-- Badges -->
          <!-- <div class="flex gap-2 mt-2">
            <div
              v-if="course.isBestseller"
              class="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5"
            >
              Bestseller
            </div>
            <div
              v-if="course.isNew"
              class="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5"
            >
              New
            </div>
          </div> -->
          <button
            @click="handleUnenroll(course)"
            class="cursor-pointer block w-full text-center py-2 px-4 rounded mt-3 transition bg-purple-600 text-white hover:bg-purple-700"
          >
            {{ loading ? "Removing" : "Remove" }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Feedback Modal -->
  <FeedbackModal
    :isOpen="showFeedbackModal"
    :courseId="selectedCourseId"
    @close="showFeedbackModal = false"
  />
</template>

<style scoped>
.aspect-video {
  aspect-ratio: 16 / 9;
}
</style>
