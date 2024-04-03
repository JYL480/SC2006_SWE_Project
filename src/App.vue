<template>
  <router-link id="link" to="/LandingPage" class="logo"
    ><img :src="myImage" alt="Map Image"
  /></router-link>

  <TopBar></TopBar>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";
import TopBar from "./components/TopBar.vue";
import myImage from "@/assets/image_2024-04-01_13-52-19.png";

const isLoggedIn = ref(false);
const router = useRouter();

let auth;
onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
    }
  });
});

const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push("/LandingPage");
  });
};
</script>

<style scoped>
img {
  width: 20%;
  height: auto;
  z-index: 1;
  padding-left: 20px;
  display: flex;
}

.logo {
  margin-top: 10px;
}
</style>
