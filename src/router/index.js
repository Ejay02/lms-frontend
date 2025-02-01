import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/homeView.vue";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: "/my-courses",
      name: "courses",
      component: () => import("../views/myCourses.vue"),
      meta: { requiresAuth: true },
    },
    // {
    //   path: "/courses/:id",
    //   name: "course-details",
    //   component: () => import("../views/CourseDetailsView.vue"),
    //   meta: { requiresAuth: true },
    // },
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
      path: "/:catchAll(.*)",
      name: "not-found",
      component: () => import("../components/ui/notFound.vue"),
      
    },
  ],
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const isAuthenticated = !!auth.token;

  if (!isAuthenticated && to.path !== "/login" && to.path !== "/register") {
    next("/login");
  } else if (
    isAuthenticated &&
    (to.path === "/login" || to.path === "/register")
  ) {
    next("/");
  } else {
    next();
  }
});

export default router;
