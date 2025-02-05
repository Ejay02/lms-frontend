<template>
  <RouterLink to="/home" class="p-2 cursor-pointer">
    <i
      class="fa-solid fa-arrow-left-long text-gray-400 mb-4 hover:animate-bounce"
    ></i>
  </RouterLink>
  <div class="max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-center">
      {{ isInstructor ? "Instructor Registration" : "Register" }}
    </h1>

    <Alert v-if="errorMessage" type="error" :message="errorMessage" />

    <form @submit.prevent="handleSubmit">
      <FormInput
        v-model="form.name"
        label="Name"
        :error="errors.name"
        placeholder="Jane Gates"
        @input="validateField('name')"
      />

      <FormInput
        v-model="form.email"
        label="Email"
        type="email"
        :error="errors.email"
        placeholder="example@example.com"
        @input="validateField('email')"
      />

      <div class="relative">
        <FormInput
          v-model="form.password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          :error="errors.password"
          placeholder="Enter your password"
          @input="validateField('password')"
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

      <FormInput
        v-model="form.confirmPassword"
        label="Confirm Password"
        :type="showPassword ? 'text' : 'password'"
        :error="errors.confirmPassword"
        placeholder="Confirm your password"
        @input="validateField('confirmPassword')"
      />

      <button
        type="submit"
        class="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        :disabled="loading || !isFormValid"
      >
        <LoadingSpinner v-if="loading" size="sm" class="mx-auto" />
        <span v-else>Register</span>
      </button>
    </form>

    <div class="relative flex items-center my-6">
      <div class="flex-grow border-t border-gray-300"></div>
      <span class="mx-4 text-gray-500">OR</span>
      <div class="flex-grow border-t border-gray-300"></div>
    </div>

    <GoogleLogin :callback="callback" class="w-full">
      <button
        class="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 cursor-pointer text-gray-700 py-2 rounded-md hover:bg-indigo-100 shadow-sm"
      >
        <img src="/google.svg" alt="Google" class="w-6 h-6" />
        <span>Sign in with Google</span>
      </button>
    </GoogleLogin>

    <p class="mt-4 text-center text-gray-600 text-sm">
      Already have an account?
      <RouterLink to="/login" class="text-indigo-500 hover:underline">
        Login
      </RouterLink>
    </p>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRoute, useRouter } from "vue-router";
import FormInput from "../components/ui/formInput.vue";
import Alert from "../components/ui/alert.vue";
import LoadingSpinner from "../components/ui/loadingSpinner.vue";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const isInstructor = ref(false);

onMounted(() => {
  isInstructor.value = route.query.role === "instructor";
});

const form = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const errors = ref({});
const loading = ref(false);
const errorMessage = ref("");
const showPassword = ref(false);

const validateField = (field) => {
  delete errors.value[field];

  switch (field) {
    case "name":
      if (!form.value.name.trim()) {
        errors.value.name = "Name is required";
      }
      break;

    case "email":
      if (!form.value.email) {
        errors.value.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        errors.value.email = "Invalid email format";
      }
      break;

    case "password":
      if (!form.value.password) {
        errors.value.password = "Password is required";
      } else if (form.value.password.length < 6) {
        errors.value.password = "Password must be at least 6 characters";
      }
      break;

    case "confirmPassword":
      if (form.value.password !== form.value.confirmPassword) {
        errors.value.confirmPassword = "Passwords do not match";
      }
      break;
  }
};

const validate = () => {
  errors.value = {};

  ["name", "email", "password", "confirmPassword"].forEach((field) => {
    validateField(field);
  });

  return Object.keys(errors.value).length === 0;
};

const isFormValid = computed(() => {
  const nameValid = form.value.name.trim();
  const emailValid = form.value.email;
  const passwordLengthValid = form.value.password.length >= 6;
  const passwordsMatch = form.value.password === form.value.confirmPassword;
  const noErrors = Object.keys(errors.value).length === 0;

  return (
    nameValid && emailValid && passwordLengthValid && passwordsMatch && noErrors
  );
});

const handleSubmit = async () => {
  if (!validate()) return;

  loading.value = true;
  errorMessage.value = "";

  try {
    if (isInstructor.value) {
      await auth.registerInstructor(form.value);
    } else {
      await auth.register(form.value);
    }
    await router.push({ path: "/", replace: true });
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Registration failed";
  } finally {
    loading.value = false;
  }
};

const callback = async (response) => {
  try {
    await auth.googleAuth({
      code: response.code,
      isInstructor: isInstructor.value,
    });
    await router.push({ path: "/", replace: true });
  } catch (error) {}
};
</script>
