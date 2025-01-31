<template>
  <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
    <div class="text-center">
      <i :class="[icon, 'text-gray-400 text-4xl mb-3']"></i>
      <h4 class="text-lg font-semibold text-gray-600 mb-2">{{ heading }}</h4>
      <p class="text-sm text-gray-500 mb-4">{{ description }}</p>

      <!-- Conditional Button Rendering -->
      <button
        v-if="buttonText"
        @click="buttonAction"
        class="cursor-pointer bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-500 transition"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
  heading: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
    default: "",
  },
  buttonAction: {
    type: Function,
    default: () => {},
  },
});
</script>

<style scoped></style>
