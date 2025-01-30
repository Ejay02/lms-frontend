<script setup>
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const navigateToCourses = () => {
  if (auth.token) {
    router.push("/courses");
  } else {
    router.push("/login");
  }
};
</script>

<template>
  <router-view />
  <div class="max-w-4xl mx-auto text-center mt-28">
    <h1 class="text-4xl font-bold mb-6">Welcome to LMS Platform</h1>
    <p class="text-xl text-gray-600 mb-8">
      Access quality education anytime, anywhere
    </p>
    <button
      @click="navigateToCourses"
      class="bg-indigo-500 text-white px-6 py-3 rounded-md hover:bg-indigo-300 cursor-pointer"
    >
      Get Started
    </button>
  </div>
</template>
