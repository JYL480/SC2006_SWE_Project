<template>
  <div id="map-container"></div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onUpdated,
  onUnmounted,
  computed,
  onBeforeMount,
} from "vue";
import { MapboxMap, MapboxGeolocateControl } from "@studiometa/vue-mapbox-gl";
import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import GeolocateControl from "mapbox-gl";

// const process.env.MAPBOX_TOKEN;
mapboxgl.accessToken =
  "pk.eyJ1IjoibGp5NDgwIiwiYSI6ImNsdGY4a2F1MjBtNzEyam45MzV5bXl1NG8ifQ.e1MgohLQEySFfrautJ_7lQ";

// Define a ref to hold the map instance

const geojsonFeaturesERP = ref([]);
const geojsonFeaturesCarPark = ref([]);
const mapCenter = ref([103.82287200000002, 1.3649170000000002]);
let userLocation = ref([]);
let centerLat = null;
let centerLng = null;

let map = null;
const createMapInstance = () => {
  map = new mapboxgl.Map({
    container: "map-container",
    style: "mapbox://styles/mapbox/streets-v12", // Replace with your preferred map style
    center: [103.82287200000002, 1.3649170000000002],
    zoom: 11,
  });
  return map;
};

// To get the person location?
const accessJsonERP = async () => {
  try {
    const response = await fetch("ERPTEST.geoJson");
    if (!response.ok) {
      throw new Error("Failed to fetch JSON data");
    }
    const jsonData = await response.json();
    geojsonFeaturesERP.value = jsonData.features;
  } catch (error) {
    console.error(error);
  }
};

const accessJsonCar = async () => {
  try {
    const response = await fetch("geoJsonCar.geoJson");
    if (!response.ok) {
      throw new Error("Failed to fetch JSON data");
    }
    const jsonData = await response.json();
    geojsonFeaturesCarPark.value = jsonData;
  } catch (error) {
    console.error(error);
  }
};

const addERPMarkers = () => {
  const coor = geojsonFeaturesERP.value;
  let properties_name = null;
  let properties_price = null;
  for (let i = 0; i < coor.length; i++) {
    // console.log(
    //   coor[i].geometry.coordinates[0][0],
    //   coor[i].geometry.coordinates[1][1]
    // );
    properties_name = coor[i].properties.Name;
    properties_price = coor[i].properties.price;
    new mapboxgl.Marker({
      color: "blue",
    })
      .setLngLat([
        coor[i].geometry.coordinates[0][0],
        coor[i].geometry.coordinates[1][1],
      ])
      .setPopup(
        // console.log()
        new mapboxgl.Popup().setHTML(
          `<h3>${properties_name}</h3><p>$ ${properties_price}</p>`
        )
      ) // Customize popup content
      .addTo(map);
  }
  // map.addSource("places", {
  //   type: "geojson",
  //   data: "../assets/ERPTEST.geoJson",
  // });

  // map.addLayer({
  //   id: "places",
  //   type: "symbol",
  //   source: "places",
  //   layout: {
  //     "icon-image": "marker-15",
  //     "icon-allow-overlap": true,
  //   },
  // });
};

const addCarParkMarkers = () => {
  const arraysCarPark = geojsonFeaturesCarPark.value;
  // console.log(arraysCarPark[0].car_park_no);
  let properties_name = null;
  let properties_price = null;
  // console.log(arraysCarPark[0].Longitude);
  // console.log(arraysCarPark[0].Latitude);

  for (let i = 0; i < arraysCarPark.length; i++) {
    properties_name = arraysCarPark[0].car_park_no;
    // properties_price = arraysCarPark[0];
    new mapboxgl.Marker({
      color: "red",
    })
      .setLngLat([arraysCarPark[i].Longitude, arraysCarPark[i].Latitude])
      .setPopup(
        // console.log()
        new mapboxgl.Popup().setHTML(`<h3>dfdfg</h3><p>$ sdf</p>`)
      ) // Customize popup content
      .addTo(map);
  }
};

// To get the person's location now!!
const getUserLocation = (e) => {
  const geolocateControl = map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    })
  );
  navigator.geolocation.getCurrentPosition((position) => {
    userLocation.value = [position.coords.longitude, position.coords.latitude];
    centerLat = position.coords.latitude;
    centerLng = position.coords.longitude;
    console.log(userLocation.value);
  });
};

// I want to show the markers within a certain bound of the user location!!!

const showMarkersWithinBounds = () => {
  // Below will be 1km radius around the person!

  const latOffset = 0.009; // For 1km radius at any latitude
  const lngOffset = latOffset / Math.cos((centerLat * Math.PI) / 180);

  const bounds = new mapboxgl.LngLatBounds(
    [centerLng - lngOffset, centerLat - latOffset], // Southwest coordinates
    [centerLng + lngOffset, centerLat + latOffset] // Northeast coordinates
  );
};

onMounted(async () => {
  createMapInstance();
  await getUserLocation();
  await accessJsonERP();
  await accessJsonCar();
  showMarkersWithinBounds();
  addERPMarkers();
  // addCarParkMarkers();
});

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});
// "mapbox://styles/ljy480/cltfztv7d00ub01nw3uhsceke/draft",
</script>

<style>
#map-container {
  width: 100%;
  height: 600px;
}
.map-container {
  flex: 1;
}

.marker {
  background-image: ("../assets/googleIcon.png");
  background-size: cover;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
}
</style>

<!-- Rather than doing this, I will create a JSON file, and parsr thrufh!! -->
