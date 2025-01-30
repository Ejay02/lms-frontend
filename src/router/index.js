import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
    },
    {
      path: "/courses",
      name: "courses",
      component: () => import("../views/CoursesView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/courses/:id",
      name: "course-details",
      component: () => import("../views/CourseDetailsView.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("token");

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
