<template>
  <div class="flex items-center">
    <div
      v-for="star in stars"
      :key="star.id"
      class="cursor-pointer"
      @mouseover="setHover(star.id)"
      @mouseleave="clearHover"
      @click="updateRating(star.id)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        :fill="star.id <= (hoverRating || internalRating) ? 'yellow' : 'gray'"
        viewBox="0 0 20 20"
        fill="currentColor"
        :class="{
          'fill-yellow-400': star.id <= (hoverRating || internalRating),
          'fill-gray-300': star.id > (hoverRating || internalRating),
        }"
      >
        <path
          d="M9.049 2.927C9.313 2.258 10.687 2.258 10.951 2.927l1.03 2.091a1 1 0 0 0 .757.493l2.308.335c.907.131 1.277 1.258.617 1.89l-1.671 1.63a1 1 0 0 0-.288.89l.395 2.293c.154.895-.783 1.58-1.564 1.16l-2.067-1.09a1 1 0 0 0-.936 0l-2.067 1.09c-.78.42-1.718-.265-1.564-1.16l.395-2.293a1 1 0 0 0-.288-.89l-1.67-1.63c-.66-.632-.29-1.759.617-1.89l2.309-.335a1 1 0 0 0 .758-.493l1.03-2.091z"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  rating: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["update:rating"]);

const maxStars = 5;

const hoverRating = ref(null);

// Use a local ref for the rating which syncs with the prop
const internalRating = ref(props.rating);

// Watch for changes from the parent to update the internal rating
watch(
  () => props.rating,
  (newVal) => {
    internalRating.value = newVal;
  }
);

const stars = Array.from({ length: maxStars }, (_, index) => ({
  id: index + 1,
}));

const updateRating = (id) => {
  internalRating.value = id;
  // Emit the update event to sync with the parent component
  emit("update:rating", id);
};

const setHover = (id) => {
  hoverRating.value = id;
};

const clearHover = () => {
  hoverRating.value = null;
};
</script>

<style scoped></style>
