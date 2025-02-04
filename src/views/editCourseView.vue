<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto bg-gray-200 rounded-lg shadow-md p-6">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex justify-between">
          <h1 class="text-3xl font-bold text-gray-800">Edit Course</h1>
          <RouterLink to="/">
            <i class="fa-solid fa-xmark cursor-pointer text-gray-400"></i>
          </RouterLink>
        </div>
        <p class="text-gray-600 mt-2">
          Update the details of your existing course
        </p>
      </div>

      <form v-if="courseData" @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Course Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Course Title
            <span class="text-red-500">*</span>
          </label>
          <input
            v-model="courseData.title"
            type="text"
            class="w-full px-4 py-2 border rounded-md focus:border-transparent"
            :class="{ 'border-red-500': errors.title }"
            placeholder="e.g., Complete Vue.js Development Course"
          />
          <p v-if="errors.title" class="mt-1 text-sm text-red-500">
            {{ errors.title }}
          </p>
        </div>

        <!-- Course Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Course Description
            <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="courseData.description"
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-transparent"
            :class="{ 'border-red-500': errors.description }"
            placeholder="Describe what students will learn in this course..."
          ></textarea>
          <p v-if="errors.description" class="mt-1 text-sm text-red-500">
            {{ errors.description }}
          </p>
        </div>

        <!-- Cover Image URL -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Cover Image URL
            <span class="text-red-500">*</span>
          </label>
          <div class="space-y-2">
            <input
              v-model="courseData.coverImage"
              type="url"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-transparent"
              :class="{ 'border-red-500': errors.coverImage }"
              placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
            />
            <div
              v-if="courseData.coverImage"
              class="relative mt-2 border rounded-lg p-2"
            >
              <img
                :src="courseData.coverImage"
                alt="Course cover preview"
                class="max-h-48 mx-auto rounded"
                @error="handleImageError"
              />
              <button
                type="button"
                class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                @click="courseData.coverImage = ''"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            <p v-if="errors.coverImage" class="mt-1 text-sm text-red-500">
              {{ errors.coverImage }}
            </p>
          </div>
        </div>

        <!-- Course Content -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Course Content
            <span class="text-red-500">*</span>
          </label>
          <div class="space-y-4">
            <div
              v-for="(item, index) in courseData.content"
              :key="index"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Section Title
                  <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="item.title"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md"
                  :class="{ 'border-red-500': errors.content && !item.title }"
                  placeholder="Enter section title..."
                />
              </div>
              <div class="flex items-center justify-between mb-2">
                <select
                  v-model="item.type"
                  class="px-3 py-1 border border-gray-300 rounded-md"
                >
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
                <button
                  type="button"
                  class="text-red-500 hover:text-red-600"
                  @click="removeContentItem(index)"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>

              <div v-if="item.type === 'text'">
                <textarea
                  v-model="item.data"
                  rows="3"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter text content..."
                ></textarea>
              </div>

              <div v-else-if="item.type === 'image'" class="space-y-2">
                <input
                  v-model="item.data"
                  type="url"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter image URL..."
                />
                <img
                  v-if="item.data"
                  :src="item.data"
                  alt="Content image"
                  class="max-h-32 rounded mt-2"
                  @error="(e) => handleContentImageError(e, index)"
                />
              </div>

              <div v-else-if="item.type === 'video'" class="space-y-2">
                <input
                  v-model="item.data"
                  type="url"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter video URL..."
                />
              </div>
            </div>

            <button
              type="button"
              class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-500"
              @click="addContentItem"
            >
              <i class="fas fa-plus mr-2"></i>
              Add Content Section
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            class="cursor-pointer px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            @click="router.push('/')"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="cursor-pointer px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 disabled:opacity-50"
            :disabled="loading"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            {{ loading ? "Updating Course..." : "Update Course" }}
          </button>
        </div>
      </form>

      <div v-else class="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import LoadingSpinner from "../components/ui/loadingSpinner.vue";
import { useInstructorCoursesStore } from "../stores/instructorCourse";

const router = useRouter();
const route = useRoute();
const instructorCoursesStore = useInstructorCoursesStore();

const courseData = ref(null);
const loading = ref(false);
const error = ref("");

const errors = reactive({
  title: "",
  description: "",
  coverImage: "",
  content: "",
});

onMounted(async () => {
  try {
    const courseId = route.params.id;

    const response = await instructorCoursesStore.fetchSingleCourse(courseId);
    const course = response.course;

    courseData.value = {
      title: course.title,
      description: course.description,
      coverImage: course.coverImage,
      content: course.content.map((item) => ({
        title: item.title,
        type: item.type,
        data: item.data,
        description: item.description || "",
      })),
    };
  } catch (err) {
    error.value = "Failed to load course details";
  }
});

const validateForm = () => {
  Object.keys(errors).forEach((key) => (errors[key] = ""));
  let isValid = true;

  if (!courseData.value.title.trim()) {
    errors.title = "Course title is required";
    isValid = false;
  }

  if (!courseData.value.description.trim()) {
    errors.description = "Course description is required";
    isValid = false;
  }

  if (!courseData.value.coverImage.trim()) {
    errors.coverImage = "Cover image URL is required";
    isValid = false;
  } else if (!isValidUrl(courseData.value.coverImage)) {
    errors.coverImage = "Please enter a valid image URL";
    isValid = false;
  }

  if (courseData.value.content.length === 0) {
    errors.content = "At least one content section is required";
    isValid = false;
  }

  const invalidContentTitles = courseData.value.content.some(
    (item) => !item.title.trim()
  );
  if (invalidContentTitles) {
    errors.content = "All content sections must have a title";
    isValid = false;
  }

  return isValid;
};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const handleImageError = (e) => {
  e.target.src = "/placeholder-image.jpg";
  errors.coverImage = "Failed to load image. Please check the URL";
};

const handleContentImageError = (e, index) => {
  e.target.src = "/placeholder-image.jpg";
  errors.content = `Failed to load image in section ${index + 1}`;
};

const addContentItem = () => {
  courseData.value.content.push({
    title: "",
    type: "text",
    data: "",
    description: "",
  });
};

const removeContentItem = (index) => {
  courseData.value.content.splice(index, 1);
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    loading.value = true;
    const courseId = route.params.id;
    await instructorCoursesStore.updateCourse(courseId, courseData.value);
    router.push("/");
  } catch (error) {
    console.error("Course update error:", error);
  } finally {
    loading.value = false;
  }
};
</script>
