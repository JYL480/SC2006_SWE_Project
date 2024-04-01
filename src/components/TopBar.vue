<template>     
    <router-view></router-view>
<div class="text">
    
    <button id="button" class="pushable">
        <span class="shadow"></span>
        <span class="edge"></span>
        <span class="front">
            <router-link id="link" to="/LandingPage">Home</router-link>
        </span>
        </button>

        <button id="button" class="pushable">
        <span class="shadow"></span>
        <span class="edge"></span>
        <span class="front">
            <router-link id="link" to="/Register">Register</router-link>
        </span>
        </button>

        <button id="button" class="pushable">
        <span class="shadow"></span>
        <span class="edge"></span>
        <span class="front">
            <router-link id="link" to="/Login">Login</router-link>
        </span>
        </button>

        <button id="button" class="pushable" @click="handleSignOut" v-if="isLoggedIn">
        <span class="shadow"></span>
        <span class="edge"></span>
        <span class="front">
            <button>Logout</button>
        </span>
        </button>
</div>
</template>

<script>

</script>

<style>

#link{
  text-decoration: none;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}


.pushable {
  position: relative;
  left:20px;
  top: -130px;
  background: transparent;
  padding: 0px;
  border: none;
  cursor: pointer;
  outline-offset: 4px;
  outline-color: deeppink;
  transition: filter 250ms;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
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
  padding: 10px 32px;
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

</style>
