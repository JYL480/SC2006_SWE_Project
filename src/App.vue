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
</template>

<script setup></script>

<style></style>
