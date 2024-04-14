<template>
  <router-link id="link" to="/LandingPage">
    <div id="logo">
      <img class="logoImg" src="../assets/logo.png" />
    </div>
  </router-link>

  <router-link id="link" to="/LandingPage">
    <button id="button" class="pushable">
      <span class="shadow"></span>
      <span class="edge"></span>
      <span class="front"> Home </span>
    </button>
  </router-link>
  <router-link id="link" to="/Register">
    <button id="button" class="pushable">
      <span class="shadow"></span>
      <span class="edge"></span>
      <span class="front"> Register </span>
    </button>
  </router-link>

  <router-link id="link" to="/Login" v-if="!isLoggedIn">
    <button id="button" class="pushable">
      <span class="shadow"></span>
      <span class="edge"></span>
      <span class="front"> Login </span>
    </button>
  </router-link>

  <button class="pushable" @click="handleSignOut" v-if="isLoggedIn">
    <span class="shadow"></span>
    <span class="edge"></span>
    <span class="front">Logout</span>
  </button>
  <span class="displayName" v-if="isLoggedIn">
    <span class="front"> Welcome {{ auth.currentUser.displayName }}</span>
  </span>

  <router-view></router-view>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const isLoggedIn = ref(false);
const router = useRouter();

const auth = getAuth();
onMounted(() => {
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
    router.push("/Login");
  });
};
</script>

<style scoped>
#link {
  text-decoration: none;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
.displayName {
  z-index: 100;
  display: flex;
  top: 16px;
  left: 20px;
  position: relative;
  width: fit-content;
  height: fit-content;
  /* Other styles as needed */
}

.pushable {
  position: relative;
  background: transparent;
  left: 20px;
  top: 5px;
  padding: 0px;
  border: none;
  cursor: pointer;
  outline-offset: 4px;
  outline-color: deeppink;
  transition: filter 250ms;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  z-index: 100;
}

.shadow {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: hsl(226, 25%, 69%);
  border-radius: 8px;
  filter: blur(2px);
  will-change: transform;
  transform: translateY(2px);
  transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
}

.edge {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 8px;
  background: linear-gradient(
    to right,
    hsl(15, 100%, 47%) 0%,
    hsl(15, 39%, 49%) 8%,
    hsl(15, 39%, 39%) 92%,
    hsl(15, 39%, 29%) 100%
  );
}

.front {
  display: block;
  position: relative;
  border-radius: 8px;
  background: hsl(15, 100%, 41%);
  padding: 10px 20px;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-size: 1rem;
  transform: translateY(-4px);
  transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
}

.pushable:hover {
  filter: brightness(110%);
}

.pushable:hover .front {
  transform: translateY(-6px);
  transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
}

.pushable:active .front {
  transform: translateY(-2px);
  transition: transform 34ms;
}

.pushable:hover .shadow {
  transform: translateY(4px);
  transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
}

.pushable:active .shadow {
  transform: translateY(1px);
  transition: transform 34ms;
}

.pushable:focus:not(:focus-visible) {
  outline: none;
}
.logoImg {
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
