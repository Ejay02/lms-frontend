<script setup>
defineProps({
  type: {
    type: String,
    default: "error",
  },
  message: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div
    :class="[
      'p-4 rounded-md mb-4',
      type === 'error'
        ? 'bg-red-50 text-red-700'
        : type === 'success'
        ? 'bg-green-50 text-green-700'
        : 'bg-blue-50 text-blue-700',
    ]"
  >
    {{ message }}
  </div>
</template>
