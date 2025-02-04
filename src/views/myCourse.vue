<script setup>
import { useRoute } from "vue-router";
import { ref, computed, onMounted } from "vue";
import { useInstructorCoursesStore } from "../stores/instructorCourse";
import Alert from "../components/ui/Alert.vue";
import LoadingSpinner from "../components/ui/LoadingSpinner.vue";

const route = useRoute();
const course = ref(null);
const activeLesson = ref(0);

const error = ref(null);
const courseStore = useInstructorCoursesStore();

onMounted(async () => {
  try {
    const fetchedCourse = await courseStore.fetchSingleCourse(route.params.id);
    course.value = fetchedCourse.course;
  } catch (err) {
    error.value = err;
  }
});

// Computed to safely get the current lesson
const currentLesson = computed(() => {
  return course.value?.content?.[activeLesson.value] || null;
});

// Method to toggle lesson completion
const toggleLessonCompletion = async (lessonId) => {
  try {
    // If lesson is already completed, remove it; otherwise, add it
    if (completedLessons.value.includes(lessonId)) {
      completedLessons.value = completedLessons.value.filter(
        (id) => id !== lessonId
      );
    } else {
      completedLessons.value.push(lessonId);
    }

    // Call store method to update completed lessons on the backend
    await courseStore.updateCompletedLessons(
      course.value._id,
      completedLessons.value
    );
  } catch (err) {
    console.error("Failed to update lesson completion:", err);
  }
};
</script>

<template>
  <RouterLink to="/my-courses" class="text-gray-500 mb-6 inline-block">
    <i class="fa-solid fa-arrow-left hover:animate-bounce"></i>
  </RouterLink>

  <Alert v-if="error" type="error" :message="error" />

  <div v-if="loading" class="py-12 flex justify-center">
    <LoadingSpinner size="lg" />
  </div>

  <div v-else-if="course" class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Course Header -->
      <div class="mb-8">
        <div class="flex items-center space-x-4 mb-6">
          <img
            v-if="course.coverImage"
            :src="course.coverImage"
            alt="course cover"
            class="w-12 h-12 object-cover rounded-lg shadow-sm"
          />
          <div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
              {{ course.title }}
            </h1>
            <p class="text-gray-600 text-sm">{{ course.description }}</p>
          </div>
        </div>
      </div>

      <!-- Course Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content Area -->
        <div class="lg:col-span-2">
          <div
            v-if="currentLesson"
            class="bg-gray-200 rounded-xl shadow-sm overflow-hidden"
          >
            <div class="p-6">
              <!-- Video Content -->
              <div
                v-if="currentLesson.type === 'video'"
                class="aspect-video bg-gray-900 rounded-lg flex items-center justify-center"
              >
                <video
                  class="w-full h-full rounded-lg"
                  controls
                  :src="currentLesson.data"
                ></video>
              </div>

              <!-- Text Content -->
              <div
                v-else-if="currentLesson.type === 'text'"
                class="bg-white p-6 rounded-lg shadow"
              >
                <p class="text-gray-700">
                  {{ currentLesson.data }}
                </p>
              </div>

              <!-- Image Content -->
              <div
                v-else-if="currentLesson.type === 'image'"
                class="aspect-video bg-gray-100 rounded-lg overflow-hidden"
              >
                <img
                  :src="currentLesson.data"
                  :alt="currentLesson.title"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>

            <div class="border-t border-gray-100 p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-2">
                {{ currentLesson.title }}
              </h2>
              <p class="text-gray-600">
                {{ currentLesson.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="p-4 bg-gray-200 border-b border-gray-100">
              <h3 class="text-lg font-medium text-gray-900">Course Content</h3>
            </div>
            <div class="divide-y divide-gray-100">
              <div
                v-for="(lesson, index) in course.content"
                :key="lesson._id"
                @click="activeLesson = index"
                class="flex p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                :class="{ 'bg-indigo-50': activeLesson === index }"
              >
                <!-- Lesson Completion Checkbox -->
                <div>
                  <!-- :checked="completedLessons.includes(lesson._id)" -->
                  <input
                    type="checkbox"
                    :id="lesson._id"
                    @change="toggleLessonCompletion(lesson._id)"
                    class="form-checkbox h-3 w-3 text-center mt-4 mr-3 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300 cursor-pointer"
                  />
                </div>

                <!--  -->
                <div class="flex items-center space-x-3">
                  <div
                    class="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center"
                  >
                    <i
                      class="fas text-indigo-500"
                      :class="{
                        'fa-play': lesson.type === 'video',
                        'fa-file-alt': lesson.type === 'text',
                        'fa-image': lesson.type === 'image',
                      }"
                    ></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-medium text-gray-900">
                      {{ lesson.title }}
                    </h4>
                    <p class="text-sm text-gray-500 capitalize">
                      {{ lesson.type }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 bg-white rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-center">
          <!-- Instructor Information -->
          <div v-if="course.instructor" class="flex items-center space-x-4">
            <div>
              <p class="text-sm font-medium text-gray-900">
                {{ course.instructor.name }}
              </p>
              <p class="text-sm text-gray-500">Instructor</p>
            </div>
          </div>

          <!-- Course Rating -->
          <div class="flex items-center">
            <span class="text-orange-400 font-bold text-sm mr-2">
              {{ course.rating || "4.5" }}
            </span>
            <div class="flex text-orange-400">
              <template v-for="i in 5" :key="i">
                <i class="fas fa-star text-xs"></i>
              </template>
            </div>
            <span class="text-gray-500 text-xs ml-2">
              ({{ course.totalRatings || "2,451" }})
            </span>
          </div>
        </div>

        <!-- Course Meta Information -->
        <div class="flex items-center text-xs text-gray-500 mt-4 space-x-4">
          <div class="flex items-center">
            <i class="far fa-clock mr-1"></i>
            <span>{{ course.duration || "6.5 hours" }}</span>
          </div>
          <div class="flex items-center">
            <i class="fas fa-user-friends mr-1"></i>
            <span>{{ course?.students.length }} Student(s)</span>
          </div>
          <div class="flex items-center">
            <i class="far fa-closed-captioning mr-1 text-gray-400"></i>
            <span>{{
              course.hasSubtitles ? "Subtitles Available" : "No Subtitles"
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
