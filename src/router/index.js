import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import LandingPage from "../views/LandingPage.vue";

const routes = [
  {
    path: "/Login",
    name: "Login",
    component: Login,
  },
  {
    path: "/Register",
    name: "Register",
    component: Register,
  },
  {
    path: "/LandingPage",
    name: "LandingPage",
    component: LandingPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
