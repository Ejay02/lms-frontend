<script setup>
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  auth.logout();
  router.push("/login");
};
</script>

<template>
  <nav class="bg-gray-200 shadow">
    <div class="container mx-auto px-4">
      <div class="flex justify-between h-16">
        <div class="flex">
          <RouterLink
            to="/"
            class="flex items-center text-gray-700 hover:text-gray-900 font-bold"
          >
            LMS Platform
          </RouterLink>
        </div>
        <div class="flex items-center">
          <template v-if="auth.token">
            <RouterLink
              to="/courses"
              class="text-gray-700 hover:text-gray-900 px-3 py-2"
            >
              Courses
            </RouterLink>
            <button
              @click="handleLogout"
              class="text-gray-700 hover:text-gray-900 px-3 py-2"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <RouterLink
              to="/login"
              class="text-gray-700 hover:text-gray-900 px-3 py-2"
            >
              Login
            </RouterLink>
            <RouterLink
              to="/register"
              class="text-gray-700 hover:text-gray-900 px-3 py-2"
            >
              Register
            </RouterLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
