<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import FormInput from "../components/ui/FormInput.vue";
import Alert from "../components/ui/Alert.vue";
import LoadingSpinner from "../components/ui/loadingSpinner.vue";
// import { EyeIcon, EyeOffIcon } from "@heroicons/vue/solid";

const auth = useAuthStore();
const router = useRouter();

const form = ref({
  email: "",
  password: "",
});

const errors = ref({});
const loading = ref(false);
const errorMessage = ref("");
const showPassword = ref(false);

const validate = () => {
  errors.value = {};

  if (!form.value.email) {
    errors.value.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = "Invalid email format";
  }

  if (!form.value.password) {
    errors.value.password = "Password is required";
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validate()) return;

  loading.value = true;
  errorMessage.value = "";

  try {
    await auth.login(form.value);
    router.push("/courses");
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Login failed";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto cursor-pointer">
    <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>

    <Alert v-if="errorMessage" type="error" :message="errorMessage" />

    <form @submit.prevent="handleSubmit">
      <FormInput
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        :error="errors.email"
      />

      <div class="relative">
        <FormInput
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          placeholder="Enter your password"
          :error="errors.password"
        />
        <button
          type="button"
          class="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
          @click="showPassword = !showPassword"
        >
          <!-- <EyeIcon v-if="!showPassword" class="w-5 h-5" /> -->
          <i class="fa-regular fa-eye" v-if="!showPassword"></i>
          <i class="fa-regular fa-eye-slash" v-else></i>
          <!-- <EyeOffIcon v-else class="w-5 h-5" /> -->
        </button>
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 mt-4"
        :disabled="loading"
      >
        <LoadingSpinner v-if="loading" size="sm" class="mx-auto" />
        <span v-else>Login</span>
      </button>
    </form>

    <p class="mt-4 text-center text-gray-600">
      Don't have an account?
      <RouterLink to="/register" class="text-blue-600 hover:underline">
        Register
      </RouterLink>
    </p>
  </div>
</template>
