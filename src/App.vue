<template>
  <div>
    Hello
    <nav>
      <ul>
        <router-link to="/">Home Help me</router-link>
        |
        <router-link to="/Register">Register</router-link>
        |
        <router-link to="/Login">Login</router-link>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
  
  <br>

  <navbar></navbar>

</template>

<script setup>
  import navbar from './components/NavBar.vue';
</script>

<style></style>
