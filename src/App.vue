<template>
  <div>
    App.vue
    <nav>
      <ul>
        <router-link to="/">Home Help me</router-link>
        |
        <router-link to="/Register">Register</router-link>
        |
        <router-link to="/Login">Login</router-link>
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
  import navbar from './components/NavBar.vue';
  import searchbar from './components/SearchBar.vue';
</script>

<style></style>
