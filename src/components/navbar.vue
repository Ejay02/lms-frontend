<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();
const isDropdownOpen = ref(false);

const user = auth.fetchUserDetails();
console.log("user:", user);

const handleLogout = () => {
  auth.logout();
  router.push("/login");
};

const getInitials = (name) => {
  if (!name) return "";
  const parts = name.split(" ");
  return parts.length > 1
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : parts[0][0].toUpperCase();
};
</script>

<template>
  <nav class="bg-gray-200 shadow">
    <div class="pl-4 mr-10">
      <div class="flex justify-between h-16 items-center">
        <RouterLink to="/" class="text-gray-700 hover:text-gray-900 font-bold">
          LMS Platform
        </RouterLink>
        <div class="flex items-center">
          <template v-if="auth.token">
            <RouterLink
              to="/"
              class="text-gray-700 px-3 py-2 relative hover:text-gray-400 cursor-pointer transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-gray-400 before:origin-center before:h-[1px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-gray-400 after:origin-center after:h-[1px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%]"
              activeClass="text-indigo-600 font-semibold "
            >
              Teach on LMS
            </RouterLink>
            <RouterLink
              to="/my-courses"
              class="text-gray-700 px-3 py-2 relative hover:text-gray-400 cursor-pointer transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-gray-400 before:origin-center before:h-[1px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-gray-400 after:origin-center after:h-[1px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%]"
              activeClass="text-indigo-600 font-semibold "
            >
              My Courses
            </RouterLink>
            <div class="relative ml-2">
              <button
                @click="isDropdownOpen = !isDropdownOpen"
                class="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none cursor-pointer"
              >
                <div class="pl-2">
                  <img
                    v-if="auth.user?.avatar"
                    :src="auth.user.avatar"
                    alt="User Avatar"
                    class="w-10 h-10 rounded-full border"
                  />
                  <div
                    v-else
                    class="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-200 text-white font-bold"
                  >
                    {{ getInitials(auth.user?.name) }}
                  </div>
                </div>
                <div class="pr-2">
                  <div class="text-sm font-semibold">
                    {{ auth.user?.name }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ auth.user?.role }}
                  </div>
                </div>
                <i class="fa-solid fa-chevron-down" v-if="!isDropdownOpen"></i>
                <i class="fa-solid fa-chevron-up" v-else></i>
              </button>

              <!-- dropdown -->
              <div
                v-if="isDropdownOpen"
                class="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg"
              >
                <div class="p-4 text-center">
                  <div class="relative flex items-center">
                    <div class="flex-grow border-t border-indigo-100"></div>
                    <div class="mx-4 text-gray-500">
                      <img
                        v-if="auth.user?.avatar"
                        :src="auth.user.avatar"
                        alt="User Avatar"
                        class="w-12 h-12 mx-auto rounded-full border"
                      />
                      <div
                        v-else
                        class="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-indigo-200 text-white font-bold"
                      >
                        {{ getInitials(auth.user?.name) }}
                      </div>
                    </div>
                    <div class="flex-grow border-t border-gray-300"></div>
                  </div>

                  <div class="mt-0 text-sm font-semibold">
                    {{ auth.user?.name }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ auth.user?.email }}
                  </div>
                </div>
               <!-- edit -->
                <RouterLink
                  to="/settings"
                  class="border-t border-gray-200 block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <i class="fa-solid fa-user-gear"></i>
                  <span> Edit profile </span>
                </RouterLink>

                <!-- logout -->
                <button
                  @click="handleLogout"
                  class="cursor-pointer flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 border-t border-gray-200 bg-indigo-100"
                >
                  <i class="fa-solid fa-arrow-up-right-from-square mr-2"></i>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </template>

          <!-- unauth -->
          <template v-else>
            <RouterLink
              to="/login"
              class="text-gray-700 px-3 py-2 relative hover:text-gray-400 cursor-pointer transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-gray-400 before:origin-center before:h-[1px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-gray-400 after:origin-center after:h-[1px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%]"
              activeClass="text-indigo-600 font-semibold "
            >
              Login
            </RouterLink>
            <RouterLink
              to="/register"
              class="text-gray-700 px-3 py-2 relative hover:text-gray-400 cursor-pointer transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-gray-400 before:origin-center before:h-[1px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-gray-400 after:origin-center after:h-[1px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%]"
              activeClass="text-indigo-600 font-semibold "
            >
              Register
            </RouterLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
