import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(localStorage.getItem("token"));

  const login = async (credentials) => {
    try {
      const response = await axios.post("/api/auth/login", credentials);
      token.value = response.data.token;
      localStorage.setItem("token", token.value);
      // Fetch user details here
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
  };

  return {
    user,
    token,
    login,
    logout,
  };
});
