<script setup>
import { ref } from "vue";
import { useInstructorCoursesStore } from "../../stores/instructorCourse";

const props = defineProps({
  open: Boolean,
  course: Object,
});
const emit = defineEmits(["close"]);
const instructorCoursesStore = useInstructorCoursesStore();
const deleting = ref(false);

const deleteCourse = async () => {
  if (!props.course?._id) return;
  try {
    deleting.value = true;
    await instructorCoursesStore.deleteCourse(props.course?._id);
    emit("close");
  } catch (error) {
    console.error(error);
  } finally {
    deleting.value = false;
  }
};
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 flex items-center justify-center bg-white/50 bg-opacity-50 z-50 cursor-pointer backdrop-blur-lg"
  >
    <div class="bg-white rounded-lg shadow-lg p-6 w-96">
      <div class="flex items-center justify-between border-b pb-3">
        <h3 class="text-lg font-semibold">Delete {{ course?.title }} ?</h3>

        <button @click="emit('close')">
          <i
            class="cursor-pointer fa-solid fa-xmark text-gray-500 hover:text-gray-700"
          ></i>
        </button>
      </div>
      <p class="text-sm text-gray-600 mt-3">
        Are you sure you want to delete this course? This action cannot be
        undone.
      </p>
      <div class="mt-4 flex justify-end gap-3">
        <button
          @click="emit('close')"
          class="cursor-pointer px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          @click="deleteCourse"
          :disabled="deleting"
          class="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 disabled:opacity-50"
        >
          {{ deleting ? "Deleting..." : "Delete" }}
        </button>
      </div>
    </div>
  </div>
</template>
