import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../utils/axios";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(localStorage.getItem("token"));

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
      console.error("Google registration failed:", error);
      errorMessage.value = "Google registration failed";
    }
  };

  const login = async (credentials) => {
    console.log("credentials:", credentials);
    try {
      const response = await api.post("/auth/login", credentials);

      console.log("log response:", response);

      token.value = response.data.token;

      localStorage.setItem("token", token.value);
      setAuthHeader(token.value);

      await fetchUserDetails();
    } catch (error) {
      throw error;
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await api.get("/auth/user");
      console.log("fetch response:", response);

      if (response.data.success) {
        user.value = response.data.data;

        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      user.value = null;
      throw error;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
    setAuthHeader(null);
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
