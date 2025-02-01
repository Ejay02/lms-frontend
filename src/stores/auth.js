import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../utils/axios";
import { useNotificationStore } from "./notification";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(localStorage.getItem("token"));
  const notificationStore = useNotificationStore();

  // Set up axios defaults when token changes
  const setAuthHeader = (token) => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  };

  // Initialize auth header from stored token
  setAuthHeader(token.value);

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

      // Optionally fetch user details after registration
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
      // Assuming you're redirected back with the Google token in the URL
      const urlParams = new URLSearchParams(window.location.search);
      const googleToken = urlParams.get("token"); // Make sure to include 'token' as query param

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

      router.push("/courses");
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

  const fetchUserDetails = async () => {
    try {
      const response = await api.get("/auth/user");

      if (response.data.success) {
        user.value = response.data.data;

        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      notificationStore.addNotification({
        type: "warning",
        message: "Token expired, please login again",
      });

      if (error.response?.status === 401) {
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
    setAuthHeader(null);
    notificationStore.addNotification({
      type: "success",
      message: `Logout Successful!`,
    });
  };

  return {
    user,
    token,
    register,
    registerWithGoogle,
    login,
    logout,
    fetchUserDetails,
  };
});
