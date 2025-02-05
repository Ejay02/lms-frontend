<template>
  <RouterLink to="/" class="p-2 cursor-pointer">
    <i
      class="fa-solid fa-arrow-left-long text-gray-400 mb-4 hover:animate-bounce"
    ></i>
  </RouterLink>
  <div class="max-w-2xl mx-auto p-4 cursor-pointer">
    <h1 class="text-2xl font-bold mb-6 text-center">Edit Profile</h1>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Profile Image Section -->
      <div class="space-y-4">
        <label class="block text-sm font-medium text-gray-700"
          >Profile Image</label
        >
        <div class="flex items-center space-x-4">
          <div class="relative w-24 h-24">
            <img
              v-if="imagePreview || user?.profileImage"
              :src="imagePreview || user?.profileImage"
              alt="User Avatar"
              class="w-24 h-24 rounded-full border object-cover"
              accept=".jpg, .png, .jpeg"
            />
            <div
              v-else
              class="w-24 h-24 flex items-center justify-center rounded-full bg-indigo-200 text-white font-bold text-4xl"
            >
              {{ getInitials(user?.name) }}
            </div>

            <input
              type="file"
              accept="image/*"
              class="hidden"
              ref="fileInput"
              @change="handleImageChange"
            />
          </div>
          <button
            type="button"
            @click="$refs.fileInput.click()"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Change Photo
          </button>
          <div class="text-xs text-gray-500">JPG, PNG, JPEG only, max 1MB</div>
        </div>
      </div>

      <!-- Name Field -->
      <div>
        <label for="name" class="block text-sm/6 font-medium text-gray-900"
          >Name</label
        >
        <div class="mt-2">
          <div
            class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600"
          >
            <input
              type="text"
              id="name"
              v-model="formData.name"
              class="cursor-pointer block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
            />
          </div>
        </div>
      </div>

      <!-- Email Field -->
      <div>
        <label for="email" class="block text-sm/6 font-medium text-gray-900"
          >Email</label
        >
        <div class="mt-2">
          <div
            class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600"
          >
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="cursor-pointer block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
            />
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end">
        <button
          type="submit"
          class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          :disabled="isLoading"
        >
          {{ isLoading ? "Saving..." : "Save Changes" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";
import { useNotificationStore } from "../stores/notification";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const notificationStore = useNotificationStore();

const fileInput = ref(null);
const imagePreview = ref(null);
const isLoading = ref(false);

const formData = ref({
  name: "",
  email: "",
  profileImage: null,
});

const getInitials = (name) => {
  if (!name) return "";
  const parts = name.split(" ");
  return parts.length > 1
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : parts[0][0].toUpperCase();
};

onMounted(async () => {
  try {
    await authStore.fetchUserDetails();
    if (user.value) {
      formData.value.name = user.value.name;
      formData.value.email = user.value.email;
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
});

const handleImageChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);

    formData.value.profileImage = file;
  }
};

// TODO : image needs to be uploaded to a bucket and url sent to the BE. Not a priority for me because they aren't free and a lot of memory.
const handleSubmit = async () => {
  try {
    isLoading.value = true;

    // Send data directly since image is already in base64 ??? too much pls aborting
    const dataToSubmit = {
      name: formData.value.name,
      email: formData.value.email,
      profileImage: formData.value.profileImage,
    };

    await authStore.updateProfile(dataToSubmit);
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: "Not setup to change image",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
