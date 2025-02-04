<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import Alert from "../components/ui/Alert.vue";
import EmptyState from "../components/ui/emptyState.vue";
import DeleteModal from "../components/modals/deleteModal.vue";
import LoadingSpinner from "../components/ui/LoadingSpinner.vue";
import { useInstructorCoursesStore } from "../stores/instructorCourse";
import FeedbackViewModal from "../components/modals/feedbackViewModal.vue";

const loading = ref(true);
const error = ref("");
const router = useRouter();
const showFeedback = ref(false);
const selectedCourse = ref({});
const openDelete = ref(false);
const courseToDelete = ref(null);
const searchQuery = ref("");
const instructorStore = useInstructorCoursesStore();

const filteredCourses = computed(() => {
  if (!searchQuery.value) return instructorStore?.courses;

  const query = searchQuery.value.toLowerCase();
  return instructorStore?.courses?.filter(
    (course) =>
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query)
  );
});

const goToCourses = () => {
  router.push("/");
};

const openEdit = (course) => {
  router.push(`/edit-course/${course._id}`);
};

const showFeedbackModal = (course) => {
  selectedCourse.value = course;
  showFeedback.value = true;
};

const closeFeedbackModal = () => {
  showFeedback.value = false;
  selectedCourse.value = {};
};

const showDeleteModal = (course) => {
  courseToDelete.value = course;
  openDelete.value = true;
};

onMounted(async () => {
  try {
    await instructorStore?.fetchInstructorCourses();
  } catch (err) {
    error.value = "Failed to load courses";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="bg-gray-200 rounded-md py-12 sm:py-16">
    <div class="flex justify-between items-center mb-4 px-6 lg:px-8">
      <h2
        class="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl"
      >
        Courses by you...
      </h2>

      <div class="flex items-center space-x-4">
        <div class="flex items-center border rounded-md bg-white">
          <i class="fa-solid fa-magnifying-glass px-4 text-gray-500"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search courses..."
            class="px-4 py-2 border-0 outline-none text-sm"
          />
        </div>

        <routerLink
          to="/create-course"
          class="flex cursor-pointer bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-500 transition"
        >
          <i class="fa-solid fa-plus text-center mt-1 pr-2"></i>
          <span>Create</span>
        </routerLink>
      </div>
    </div>

    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:mx-0">
        <p class="mt-2 text-lg/8 text-gray-600">
          Here are some of the courses you've created. You can always add more
          courses to your collection.
        </p>
      </div>

      <Alert v-if="error" type="error" :message="error" />

      <EmptyState
        v-if="!loading && !error && filteredCourses?.length === 0"
        icon="fa-regular fa-calendar-check"
        heading="Ready to begin?"
        description="Create your first course now"
        buttonText="Create Course"
        :buttonAction="goToCourses"
      />

      <div v-if="loading" class="py-12 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>

      <div
        v-else
        class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:mt-6 sm:pt-6 lg:mx-0 lg:max-w-none lg:grid-cols-3"
      >
        <section
          v-for="course in filteredCourses"
          :key="course?._id"
          class="flex max-w-xl flex-col items-start justify-between border rounded border-gray-300 p-2"
        >
          <div class="w-full h-48 mb-4 overflow-hidden rounded-lg">
            <img
              :src="course?.coverImage"
              :alt="course?.title"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="flex items-center gap-x-4 text-xs justify-between w-full">
            <time :datetime="course?.createdAt" class="text-gray-500">
              {{ new Date(course?.createdAt).toISOString().split("T")[0] }}
            </time>

            <div class="flex items-center">
              <i class="far fa-clock mr-1"></i>
              <span>6.5 hours</span>
            </div>

            <span
              class="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-purple-700/10 ring-inset"
            >
              Tech
            </span>
          </div>

          <div class="group relative p-2">
            <h3
              class="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600"
            >
              <span>
                <span class="absolute inset-0"></span>
                {{ course?.title }}
              </span>
            </h3>
            <p class="mt-5 line-clamp-3 text-sm/6 text-gray-600">
              {{ course?.description }}
            </p>
          </div>

          <div class="flex justify-between w-full">
            <div class="flex items-center mt-1 text-xs">
              <span class="text-orange-400 font-bold m-2">4.5</span>
              <div class="flex text-orange-400">
                <i v-for="i in 5" :key="i" class="fas fa-star text-xs"></i>
              </div>
              <span class="text-gray-500 text-xs ml-2">(2,451)</span>
            </div>

            <div class="flex items-center text-xs text-gray-500">
              <div class="flex items-center">
                <i class="fas fa-user-friends mr-1"></i>
                <span>{{ course.students?.length }} student(s)</span>
              </div>
            </div>
          </div>

          <div class="mt-2 flex items-center gap-x-6 justify-end w-full">
            <button
              @click="showFeedbackModal(course)"
              class="hover:opacity-75 transition-opacity"
            >
              <i
                class="fa-regular fa-comments text-gray-500 hover:text-gray-400 text-sm cursor-pointer"
              ></i>
            </button>
            <button
              @click="openEdit(course)"
              class="hover:opacity-75 transition-opacity"
            >
              <i
                class="fa-regular fa-pen-to-square text-blue-500 hover:text-blue-400 cursor-pointer text-sm"
              ></i>
            </button>
            <button
              @click="showDeleteModal(course)"
              class="hover:opacity-75 transition-opacity"
            >
              <i
                class="fa-solid fa-trash-can text-red-500 hover:text-red-400 text-sm cursor-pointer"
              ></i>
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>

  <FeedbackViewModal
    :show="showFeedback"
    :course="selectedCourse"
    @close="closeFeedbackModal"
  />

  <DeleteModal
    :open="openDelete"
    :course="courseToDelete"
    @close="openDelete = false"
  />
</template>

<style scoped></style>
