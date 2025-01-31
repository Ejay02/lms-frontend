<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
import NotificationsContainer from "./components/ui/notificationContainer.vue";
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <main class="container mx-auto px-4 py-8">
      <RouterView />
      <NotificationsContainer />
    </main>
  </div>
</template>
