<template>
  <div id="map-container"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { MapboxMap, MapboxGeolocateControl } from "@studiometa/vue-mapbox-gl";
import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
const mapCenter = ref([103.82287200000002, 1.3649170000000002]);

mapboxgl.accessToken =
  "pk.eyJ1IjoibGp5NDgwIiwiYSI6ImNsdGY4a2F1MjBtNzEyam45MzV5bXl1NG8ifQ.e1MgohLQEySFfrautJ_7lQ";

onMounted(() => {
  const map = new mapboxgl.Map({
    container: "map-container", // container ID
    center: mapCenter.value, // starting position [lng, lat]
    style: "mapbox://styles/ljy480/cltfztv7d00ub01nw3uhsceke/draft",
    zoom: 10, // starting zoom
  });
});
</script>

<style>
#map-container {
  width: 100%;
  height: 500px;
}
.map-container {
  flex: 1;
}
</style>
