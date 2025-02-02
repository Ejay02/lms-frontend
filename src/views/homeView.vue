<script setup>
import { onMounted, ref } from "vue";
import { useCourseStore } from "../stores/course";
import LoadingSpinner from "../components/ui/LoadingSpinner.vue";
import Alert from "../components/ui/Alert.vue";
import EmptyState from "../components/ui/emptyState.vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { useInstructorCoursesStore } from "../stores/instructorCourse";

const courseStore = useCourseStore();
const instructorStore = useInstructorCoursesStore();
const auth = useAuthStore();

const router = useRouter();

const loading = ref(true);
const error = ref("");

const handleEnroll = async (course) => {
  try {
    await courseStore.enroll(course);
  } catch (error) {
    console.error("Error enrolling:", error);
  }
};

onMounted(async () => {
  try {
    await courseStore?.fetchCourses();
    await instructorStore?.fetchInstructorCourses();
  } catch (err) {
    error.value = "Failed to load courses";
  } finally {
    loading.value = false;
  }
});

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
  }).format(price);
};

const isNew = (createdAt) => {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const timeDifference = now - createdDate; // in milliseconds
  const hoursDifference = timeDifference / (1000 * 3600); // convert to hours
  return hoursDifference < 24; // Check if it's within the last 24 hours
};

const goToCourses = () => {
  router.push("/");
};

// const posts = [
//   {
//     _id: "1",
//     title: "Vue.js for Beginners",
//     description:
//       "Learn the fundamentals of Vue.js 3 with Composition API and best practices for modern web development.",
//     coverImage: "https://picsum.photos/seed/vue1/800/600",
//     category: { title: "Marketing", href: "#" },
//     date: "Mar 16, 2020",
//     feedback: [
//       {
//         _id: "1",
//         user: { name: "John Doe" },
//         content: "Great course! Very well explained.",
//         createdAt: "2024-02-01",
//       },
//       {
//         _id: "2",
//         user: { name: "Jane Smith" },
//         content: "The exercises were very helpful.",
//         createdAt: "2024-02-02",
//       },
//     ],
//   },
//   {
//     _id: "2",
//     title: "Advanced TypeScript",
//     description:
//       "Master TypeScript with advanced types, decorators, and real-world patterns for large applications.",
//     coverImage: "https://picsum.photos/seed/ts1/800/600",
//     category: { title: "Marketing", href: "#" },
//     date: "Mar 16, 2020",
//     feedback: [
//       {
//         _id: "3",
//         user: { name: "Mike Johnson" },
//         content: "Excellent deep dive into TypeScript.",
//         createdAt: "2024-02-01",
//       },
//     ],
//   },
//   {
//     _id: "3",
//     title: "Full Stack Development",
//     description:
//       "Build complete web applications with Vue.js, Node.js, and MongoDB. Learn deployment and best practices.",
//     coverImage: "https://picsum.photos/seed/fs1/800/600",
//     category: { title: "Marketing", href: "#" },
//     date: "Mar 16, 2020",
//     feedback: [
//       {
//         _id: "4",
//         user: { name: "Sarah Wilson" },
//         content: "Very comprehensive course!",
//         createdAt: "2024-01-30",
//       },
//       {
//         _id: "5",
//         user: { name: "Tom Brown" },
//         content: "The project-based approach was perfect.",
//         createdAt: "2024-01-31",
//       },
//     ],
//   },
// ];

const showFeedbackModal = (course) => {
  currentFeedback.value = course.feedback;
  showFeedback.value = true;
};
</script>

<template>
  <!-- student -->
  <div
    v-if="auth?.user?.role === 'student'"
    class="p-6 max-w-7xl mx-auto bg-gray-200 rounded-md cursor-pointer"
  >
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">A broad selection of courses</h1>
      <div class="flex items-center border rounded-md">
        <i class="fa-solid fa-magnifying-glass px-4 text-gray-500"></i>
        <input
          v-model="courseStore.searchQuery"
          type="text"
          placeholder="Search courses..."
          class="px-4 py-2 border-0 outline-none text-sm"
        />
      </div>
    </div>

    <p class="text-md mb-8 text-gray-500 border-b border-gray-200 pb-4">
      Choose from over 1,000 online video courses with new additions published
      every month
    </p>

    <Alert v-if="error" type="error" :message="error" />

    <EmptyState
      v-if="!loading && courseStore.courses.length === 0"
      icon="fa-regular fa-calendar-check"
      heading="Nothing here yet!"
      description="Try again later"
    />

    <div v-if="loading" class="py-12 flex justify-center">
      <LoadingSpinner size="lg" />
    </div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <div
        v-for="course in courseStore?.courses"
        :key="course._id"
        class="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300 group relative rounded-md"
      >
        <!-- Course Image with Play Button Overlay -->
        <div class="">
          <img
            :src="course?.coverImage"
            class="w-full aspect-video object-cover"
            alt="Course Image"
          />
        </div>

        <!-- Course Content -->
        <div class="p-4">
          <div class="flex justify-between items-start">
            <h2 class="font-bold text-base mb-1 line-clamp-2 flex-1">
              {{ course.title }}
            </h2>
            <!-- Dropdown Menu -->
          </div>

          <p class="text-sm text-gray-500 mb-1 capitalize">
            {{ course.instructor?.name }}
          </p>

          <!-- Rating -->

          <div class="flex items-center mb-1">
            <span class="text-orange-400 font-bold text-sm mr-2">{{
              course.rating || "4.5"
            }}</span>
            <div class="flex text-orange-400">
              <template v-for="i in 5" :key="i">
                <i class="fas fa-star text-xs"></i>
              </template>
            </div>
            <span class="text-gray-500 text-xs ml-2"
              >({{ course.totalRatings || "2,451" }})</span
            >
            <!-- <div class="flex items-center"> -->
            <i class="far fa-closed-captioning ml-6 text-gray-400"></i>
            <span>{{ course.hasSubtitles ? "CC" : "" }}</span>
            <!-- </div> -->
          </div>

          <!-- Course Meta -->
          <div class="flex items-center text-xs text-gray-500 mb-2 space-x-4">
            <div class="flex items-center">
              <i class="far fa-clock mr-1"></i>
              <span>{{ course.duration || "6.5 hours" }}</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-user-friends mr-1"></i>
              <span>{{ course.enrollments || "1,245 students" }}</span>
            </div>
          </div>

          <!-- Price -->
          <div class="flex items-center mt-2">
            <span class="font-bold text-md">
              {{ formatPrice(course.price || 1999.99) }}
            </span>
            <span class="ml-2 text-sm text-gray-500 line-through">{{
              formatPrice((course.price || 1999.99) * 3)
            }}</span>
          </div>

          <!-- Badges -->
          <div class="flex gap-2 mt-2">
            <!-- v-if="course?.isBestseller" -->
            <div
              class="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5"
            >
              Bestseller
            </div>

            <div
              v-if="isNew(course.createdAt)"
              class="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5"
            >
              New
            </div>
          </div>

          <button
            @click="handleEnroll(course)"
            :disabled="courseStore.isEnrolled(course._id)"
            :class="[
              'block w-full text-center py-2 px-4 rounded mt-3 transition',
              courseStore.isEnrolled(course._id)
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700',
            ]"
          >
            {{ courseStore.isEnrolled(course._id) ? "Enrolled" : "Enroll" }}
          </button>

          <!-- Show "View Course" link only if enrolled -->
          <div class=""></div>
          <RouterLink
            v-if="courseStore.isEnrolled(course._id)"
            :to="{ name: 'course-content', params: { id: course._id } }"
            class="block w-full text-center text-purple-600 hover:text-purple-700 mt-2 text-sm"
          >
            View Course
          </RouterLink>
        </div>
      </div>
    </div>
  </div>

  <!-- teacher -->

  <div class="bg-gray-200 rounded-md py-12 sm:py-16">
    <div class="flex justify-between items-center mb-6 p-4">
      <h2
        class="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl"
      >
        Courses by you...
      </h2>

      <div class="flex items-center border rounded-md">
        <i class="fa-solid fa-magnifying-glass px-4 text-gray-500"></i>
        <input
          v-model="instructorStore.searchQuery"
          type="text"
          placeholder="Search courses..."
          class="px-4 py-2 border-0 outline-none text-sm cursor-pointer"
        />
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
        v-if="!loading && instructorStore?.courses?.length === 0"
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
        class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3"
      >
        <article
          v-for="course in instructorStore?.courses"
          :key="course?._id"
          class="flex max-w-xl flex-col items-start justify-between"
        >
          <div class="w-full h-48 mb-4 overflow-hidden rounded-lg">
            <img
              :src="course?.coverImage"
              :alt="course?.title"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="flex items-center gap-x-4 text-xs">
            <time :datetime="course?.createdAt" class="text-gray-500">
              {{ new Date(course?.createdAt).toISOString().split("T")[0] }}
            </time>

            <div class="flex items-center">
              <i class="far fa-clock mr-1"></i>
              <span>6.5 hours</span>
            </div>
            <a
              class="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
            >
              Tech
            </a>
            <span class="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-purple-700/10 ring-inset">Tech</span>
          </div>

          <div class="group relative border-b border-gray-300 p-2">
            <h3
              class="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600"
            >
              <a :href="course?.href">
                <span class="absolute inset-0"></span>
                {{ course?.title }}
              </a>
            </h3>
            <p class="mt-5 line-clamp-3 text-sm/6 text-gray-600">
              {{ course?.description }}
            </p>
          </div>

          <div class="flex justify-between w-full">
            <div class="flex items-center mt-1 text-xs">
              <span class="text-orange-400 font-bold mr-2">4.5</span>
              <div class="flex text-orange-400">
                <i v-for="i in 5" :key="i" class="fas fa-star text-xs"></i>
              </div>
              <span class="text-gray-500 text-xs ml-2">(2,451)</span>
            </div>

            <div class="flex items-center text-xs text-gray-500">
              <div class="flex items-center">
                <i class="fas fa-user-friends mr-1"></i>
                <span>1,245 students</span>
              </div>
            </div>
          </div>

          <div class="mt-2 flex items-center gap-x-6 justify-start w-full">
            <button
              @click="showFeedbackModal(course)"
              class="hover:opacity-75 transition-opacity"
            >
              <i
                class="fa-regular fa-comments text-gray-500 hover:text-gray-400 text-sm cursor-pointer"
              ></i>
            </button>
            <button class="hover:opacity-75 transition-opacity">
              <i
                class="fa-regular fa-pen-to-square text-blue-500 hover:text-blue-400 cursor-pointer text-sm"
              ></i>
            </button>
            <button
              @click="openDelete"
              class="hover:opacity-75 transition-opacity"
            >
              <i
                class="fa-solid fa-trash-can text-red-500 hover:text-red-400 text-sm cursor-pointer"
              ></i>
            </button>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
.aspect-video {
  aspect-ratio: 16 / 9;
}
</style>
