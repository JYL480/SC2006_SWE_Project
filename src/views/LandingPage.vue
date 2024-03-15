<template>
  <Map></Map>
  Landing page here
    
    <navbar></navbar>
</template>

<script setup>
import Map from "../components/Map.vue";
import "/node_modules/mapbox-gl/dist/mapbox-gl.css";
// This page is the home default page!!
import navbar from '../components/NavBar.vue';
</script>

<style>
#layout {
  flex: 1;
  display: flex;
  position: relative;
}
</style>
