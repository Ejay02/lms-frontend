import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: true },
      children: [
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

// router.beforeEach((to, from, next) => {
//   const auth = useAuthStore();
//   const isAuthenticated = !!auth.token;

//   if (!isAuthenticated && to.path !== "/login" && to.path !== "/register") {
//     next("/login");
//   } else if (
//     isAuthenticated &&
//     (to.path === "/login" || to.path === "/register")
//   ) {
//     next("/");
//   } else {
//     next();
//   }
// });
