<script setup>
defineProps({
  size: {
    type: String,
    default: "md",
  },
});
</script>

<template>
  <div class="flex justify-center items-center">
    <div
      :class="[
        'animate-spin rounded-full border-t-2 border-b-2 border-primary-600',
        size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6',
      ]"
    ></div>
  </div>
</template>
