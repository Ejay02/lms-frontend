<template>
  <div class="max-w-md mx-auto cursor-pointer">
    <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>

    <Alert v-if="errorMessage" type="error" :message="errorMessage" />

    <form @submit.prevent="handleSubmit">
      <FormInput
        v-model="form.email"
        label="Email"
        type="email"
        :error="errors.email"
        placeholder="example@example.com"
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
          class="cursor-pointer absolute right-3 top-9 text-gray-500 hover:text-gray-700"
          @click="showPassword = !showPassword"
        >
          <i class="fa-regular fa-eye" v-if="!showPassword"></i>
          <i class="fa-regular fa-eye-slash" v-else></i>
        </button>
      </div>

      <button
        type="submit"
        class="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-400 disabled:opacity-50 mt-4 cursor-pointer"
        :disabled="loading"
      >
        <LoadingSpinner v-if="loading" size="sm" class="mx-auto" />
        <span v-else>Login</span>
      </button>
    </form>

    <div class="relative flex items-center my-6">
      <div class="flex-grow border-t border-gray-300"></div>
      <span class="mx-4 text-gray-500">OR</span>
      <div class="flex-grow border-t border-gray-300"></div>
    </div>

    <button
      @click="handleGoogleLogin"
      class="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 cursor-pointer text-gray-700 py-2 rounded-md hover:bg-indigo-100 shadow-sm"
    >
      <img src="/google.svg" alt="Google" class="w-6 h-6" />
      <span>Sign in with Google</span>
    </button>

    <p class="mt-4 text-center text-gray-600 text-sm">
      Don't have an account?
      <RouterLink to="/register" class="text-indigo-600 hover:underline">
        Register
      </RouterLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import FormInput from "../components/ui/FormInput.vue";
import Alert from "../components/ui/Alert.vue";
import LoadingSpinner from "../components/ui/loadingSpinner.vue";

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
    await router.push({ path: "/", replace: true });
  } catch (error) {
    console.log("error:", error);
    errorMessage.value = error.response?.data?.message || "Login failed";
  } finally {
    loading.value = false;
  }
};

const handleGoogleLogin = async () => {
  try {
    await auth.loginWithGoogle();
    router.push("/courses");
  } catch (error) {
    errorMessage.value = "Google login failed";
  }
};
</script>
