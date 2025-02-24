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
    {
      path: "/my-course/:id",
      name: "my-course",
      component: () => import("../views/myCourse.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/create-course",
      name: "create-course",
      component: () => import("../views/createCourse.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/edit-course/:id",
      name: "edit-course",
      component: () => import("../views/editCourseView.vue"),
      meta: { requiresAuth: true },
    },

    {
      path: "/profile-setting",
      name: "course-details",
      component: () => import("../views/profileSettingsView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/home",
      name: "landing-page",
      component: () => import("../views/home.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/loginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/registerView.vue"),
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

  // If the user is not authenticated, allow navigation to login or register.
  if (
    !isAuthenticated &&
    to.path !== "/login" &&
    to.path !== "/register" &&
    to.path !== "/home"
  ) {
    return next("/home");
  }

  // If the user is authenticated...
  // if (isAuthenticated && (to.path === "/login" || to.path === "/register")) {
  //   // Check if there's a role flag present in the query (e.g., ?role=instructor)
  //   if (to.query && to.query.role) {
  //     // If the role flag is present, allow navigation to /login
  //     return next();
  //   } else {
  //     // Otherwise, redirect to home.
  //     return next("/");
  //   }
  // }

  // Otherwise, continue as normal.
  next();
});

export default router;
