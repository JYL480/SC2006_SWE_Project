<template>
  <div>
    App.vue
    <nav>
      <ul>
        <router-link to="/LandingPage">Home Help me</router-link>
        |
        <router-link to="/Register">Register</router-link>
        |
        <router-link to="/Login">Login</router-link>
        |
        <button @click="handleSignOut" v-if="isLoggedIn">Logout</button>
        |
        <router-link to="/ProfilePage">Profile</router-link>
        |
        <router-link to="BookmarkPage">Bookmark</router-link>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
  
  <br>

  <searchbar></searchbar>


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
  import navbar from './components/NavBar.vue';
  import searchbar from './components/SearchBar.vue';
</script>

<style></style>
