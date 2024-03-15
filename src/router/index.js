import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import LandingPage from "../views/LandingPage.vue";

const routes = [
  {
    path: "/",
    component: Login,
  },
  {
    path: "/Login",
    component: Login,
  },
  {
    path: "/Register",
    component: Register,
  },
  {
    path: "/LandingPage",
    component: LandingPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
