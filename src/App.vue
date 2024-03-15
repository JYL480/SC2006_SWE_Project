<template>
  <div>
    Hello
    <nav>
      <ul>
        <router-link to="/LandingPage">Home Help me</router-link>
        |
        <router-link to="/Register">Register</router-link>
        |
        <router-link to="/Login">Login</router-link>
        <button @click="handleSignOut" v-if="isLoggedIn">Logout</button>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

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

<style></style>
