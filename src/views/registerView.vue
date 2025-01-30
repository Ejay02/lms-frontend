<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import FormInput from "../components/ui/FormInput.vue";
import Alert from "../components/ui/Alert.vue";
import LoadingSpinner from "../components/ui/LoadingSpinner.vue";

const auth = useAuthStore();
const router = useRouter();

const form = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const errors = ref({});
const loading = ref(false);
const errorMessage = ref("");

const validate = () => {
  errors.value = {};

  if (!form.value.name) {
    errors.value.name = "Name is required";
  }

  if (!form.value.email) {
    errors.value.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = "Invalid email format";
  }

  if (!form.value.password) {
    errors.value.password = "Password is required";
  } else if (form.value.password.length < 6) {
    errors.value.password = "Password must be at least 6 characters";
  }

  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = "Passwords do not match";
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validate()) return;

  loading.value = true;
  errorMessage.value = "";

  try {
    await auth.register(form.value);
    router.push("/courses");
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Registration failed";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-6">Register</h1>

    <Alert v-if="errorMessage" type="error" :message="errorMessage" />

    <form @submit.prevent="handleSubmit">
      <FormInput v-model="form.name" label="Name" :error="errors.name" />

      <FormInput
        v-model="form.email"
        label="Email"
        type="email"
        :error="errors.email"
      />

      <FormInput
        v-model="form.password"
        label="Password"
        type="password"
        :error="errors.password"
      />

      <FormInput
        v-model="form.confirmPassword"
        label="Confirm Password"
        type="password"
        :error="errors.confirmPassword"
      />

      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        :disabled="loading"
      >
        <LoadingSpinner v-if="loading" size="sm" class="mx-auto" />
        <span v-else>Register</span>
      </button>
    </form>

    <p class="mt-4 text-center text-gray-600">
      Already have an account?
      <RouterLink to="/login" class="text-blue-600 hover:underline">
        Login
      </RouterLink>
    </p>
  </div>
</template>
