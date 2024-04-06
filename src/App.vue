<template>
  <router-link id="link" to="/LandingPage">
    <div id="logo">
      <img :src="myImage" alt="Map Image" />
    </div>
  </router-link>
  <!-- <button class="logOutButton" @click="handleSignOut" v-if="isLoggedIn">
    Logout
  </button> -->

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
    router.push("/login");
  });
};
</script>
<style>
img {
  width: 20vw;
  padding-left: 20px;
  z-index: 100;
}

#logo {
  display: flex;
  justify-content: left;
  align-items: center;
}

.logOutButton {
  width: 20vw;
  padding-left: 20px;
  z-index: 100;
}
</style>
