import { defineStore } from "pinia";
import { ref, onMounted } from "vue";
import api from "../utils/axios";
import { useNotificationStore } from "./notification";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(localStorage.getItem("token"));
  const notificationStore = useNotificationStore();
  const router = useRouter();

  // Set up axios defaults when token changes
  const setAuthHeader = (token) => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  };

  // Initialize auth header on store load
  setAuthHeader(token.value);

  // Persist user data from localStorage if available
  const loadUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user.value = JSON.parse(storedUser);
    }
  };

  // Call this when store is mounted to load data
  onMounted(() => {
    loadUserFromLocalStorage();
  });

  const register = async (userData) => {
    try {
      const response = await api.post("/auth/signup", {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });

      token.value = response.data.token;
      localStorage.setItem("token", token.value);
      setAuthHeader(token.value);

      await fetchUserDetails();

      notificationStore.addNotification({
        type: "success",
        message: `Signup Successful!`,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const registerInstructor = async (userData) => {
    try {
      const response = await api.post("/auth/instructor-signup", {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });

      token.value = response.data.token;
      localStorage.setItem("token", token.value);
      setAuthHeader(token.value);

      await fetchUserDetails();

      notificationStore.addNotification({
        type: "success",
        message: `Signup Successful!`,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const registerWithGoogle = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const googleToken = urlParams.get("token");

      if (!googleToken) {
        throw new Error("Google token not found");
      }

      const response = await api.post("/auth/google", {
        token: googleToken,
      });

      token.value = response.data.token;
      localStorage.setItem("token", token.value);
      setAuthHeader(token.value);

      await fetchUserDetails();

      router.push("/");
    } catch (error) {
      errorMessage.value = "Google registration failed";
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);

      token.value = response.data.token;
      localStorage.setItem("token", token.value);
      setAuthHeader(token.value);
      notificationStore.addNotification({
        type: "success",
        message: `Login Successful!`,
      });

      await fetchUserDetails();
    } catch (error) {
      throw error;
    }
  };

  const googleAuth = async (code, role) => {
    try {
      const response = await api.post("/auth/google-login", { code, role });

      token.value = response.data.token;
      localStorage.setItem("token", token.value);
      setAuthHeader(token.value);

      user.value = {
        name: response.data.name,
        email: response.data.email,
        profileImage: response.data.profileImage,
        role: response?.data?.role,
      };

      await fetchUserDetails();

      notificationStore.addNotification({
        type: "success",
        message: `Google Login Successful!`,
      });
    } catch (error) {
      throw error;
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await api.get("/auth/user");

      if (response.data.success) {
        user.value = response.data.data;
        localStorage.setItem("user", JSON.stringify(user.value)); // Persist user data

        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        notificationStore.addNotification({
          type: "warning",
          message: "Token expired, please login again",
        });

        logout();
        router.push("/login");
      }
      user.value = null;
      throw error;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Clear stored user data
    setAuthHeader(null);
    notificationStore.addNotification({
      type: "success",
      message: `Logout Successful!`,
    });
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put("/auth/update-profile", profileData);

      if (response.data.user) {
        user.value = response.data.user;
        localStorage.setItem("user", JSON.stringify(user.value)); // Persist updated user data
        notificationStore.addNotification({
          type: "success",
          message: "Profile updated successfully",
        });
      }
      return response.data;
    } catch (error) {
      notificationStore.addNotification({
        type: "error",
        message: error.response?.data?.message || "Error updating profile",
      });
      throw error;
    }
  };

  return {
    user,
    token,
    login,
    logout,
    register,
    googleAuth,
    updateProfile,
    fetchUserDetails,
    registerInstructor,
    registerWithGoogle,
  };
});
