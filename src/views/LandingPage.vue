<template>
  <Map></Map>
</template>

<script setup>
import Map from "../components/Map.vue";
import "/node_modules/mapbox-gl/dist/mapbox-gl.css";
</script>

<style>
#layout {
  flex: 1;
  display: flex;
  position: relative;
}
</style>
