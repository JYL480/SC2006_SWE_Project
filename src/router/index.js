import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import LandingPage from "../views/LandingPage.vue";
import ProfilePage from "../views/ProfilePage.vue";
import BookmarkPage from "../views/BookmarkPage.vue";


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
  {
    path: "/ProfilePage",
    name: "ProfilePage",
    component: ProfilePage,
  },
  {
    path: "/BookmarkPage",
    name: "BookmarkPage",
    component: BookmarkPage,
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
