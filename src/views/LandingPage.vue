<template>
  <Map></Map>
  <navbar></navbar>
  

</template>

<script setup>
import Map from "../components/Map.vue";
import "/node_modules/mapbox-gl/dist/mapbox-gl.css";
// This page is the home default page!!
import navbar from '../components/NavBar.vue';

</script>

<style>

.landing-page {
  position: relative;
}

.map-container {
  flex: 1;
  display: flex;
  position: relative;
}
#map-container {
  position: absolute;
  top: 0;
  left:0;
  width: 100%;
  height: 100vh;
  z-index: -1; /* lower z-index value than other components */
}

</style>
