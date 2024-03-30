<template>
  <div id="map-container"></div>
  <!-- <div id="sidebar">Longitude: -71.224518 | Latitude: 42.213995 | Zoom: 9</div>
   -->
   <SummarySideBar/>
  <ToggleERPorCarpark @ERPorCarpark="ERPorCarpark"></ToggleERPorCarpark>
  <Searchbar @selected-dest="selectedDestination" />
  <button @click="getUserLocation">Get User Location</button>
</template>

<script setup>
import {
  ref,
  onMounted,
  onUpdated,
  onUnmounted,
  computed,
  onBeforeMount,
  watch,
} from "vue";
import { MapboxMap, MapboxGeolocateControl } from "@studiometa/vue-mapbox-gl";
import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import GeolocateControl from "mapbox-gl";
import ToggleERPorCarpark from "./ToggleERPorCarpark.vue";
import Searchbar from "../components/SearchBar.vue";
import SummarySideBar from "./SummarySideBar.vue";
import { confirmPasswordReset } from "firebase/auth";

// import turf things?
import * as turf from "@turf/turf";

// const process.env.MAPBOX_TOKEN;
mapboxgl.accessToken =
  "pk.eyJ1IjoibGp5NDgwIiwiYSI6ImNsdGY4a2F1MjBtNzEyam45MzV5bXl1NG8ifQ.e1MgohLQEySFfrautJ_7lQ";

// Define a ref to hold the map instance
// All the variables

// The radius variables:
// Define the radius of the circle in kilometers
const radiusInKm = 1;
let circleLayerId = "circle";
const options = { steps: 50, units: "kilometers" };

const destMarker = new mapboxgl.Marker({
  color: "#4F7FF0",
  draggable: false,
});

const geojsonFeaturesERP = ref([]);
const geojsonFeaturesCarPark = ref([]);
const mapCenter = ref([103.82287200000002, 1.3649170000000002]);
const defaultLocation = [103.851784, 1.287953];
// Im guessing this user Location will keep changing!!!
let userLocation = ref([103.851784, 1.287953]);
let centerLat = null;
let centerLng = null;
let map = null;
let CurrentMarkersCar = [];
let CurrentMarkersERP = [];

// By default == true,
// True = carpark display, False, = ERP display
let boolCarorERP = ref(true);

let boolRemoveWhenCoorChange = ref(false);

let circle = null;

// All the functions

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

const addERPMarkers = (remove, boolRemoveWhenCoorChange) => {
  const coor = geojsonFeaturesERP.value;
  let marker = null;
  let properties_name = null;
  let properties_price = null;
  const circle = turf.circle(userLocation.value, radiusInKm, options);
  if (remove == false) {
    for (let i = 0; i < coor.length; i++) {
      let pt = turf.point([
        coor[i].geometry.coordinates[0][0],
        coor[i].geometry.coordinates[1][1],
      ]);
      if (turf.booleanPointInPolygon(pt, circle)) {
        properties_name = coor[i].properties.Name;
        properties_price = coor[i].properties.price;

        marker = new mapboxgl.Marker({
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
        CurrentMarkersERP.push(marker);
      }
    }
  } else {
    for (let i = 0; i < CurrentMarkersERP.length; i++) {
      CurrentMarkersERP[i].remove();
    }
  }
};

const addCarParkMarkers = (remove, boolRemoveWhenCoorChange) => {
  const arraysCarPark = geojsonFeaturesCarPark.value;
  let properties_name = null;
  let properties_price = null;
  let marker = null;
  const circle = turf.circle(userLocation.value, radiusInKm, options);

  // This if it to remove all the markers, so if true, then add, false then remove.
  // I created 2 currentERP and Carpark arrays. That can save the markers inside.
  // So if need be i can for loop the whole thing and remove.
  if (remove == true) {
    console.log("why not changing?", userLocation.value);
    for (let i = 0; i < arraysCarPark.length; i++) {
      let pt = turf.point([
        arraysCarPark[i].Longitude,
        arraysCarPark[i].Latitude,
      ]);
      if (turf.booleanPointInPolygon(pt, circle)) {
        properties_name = arraysCarPark[0].car_park_no;
        marker = new mapboxgl.Marker({
          color: "red",
        })
          .setLngLat([arraysCarPark[i].Longitude, arraysCarPark[i].Latitude])
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>dfdfg</h3><p>$ sdf</p>`)) // Customize popup content
          .addTo(map);
        CurrentMarkersCar.push(marker);
      }
    }
  } else {
    for (let i = 0; i < CurrentMarkersCar.length; i++) {
      CurrentMarkersCar[i].remove();
    }
  }
};

// To get the person's location now!!
const getUserLocation = (e) => {
  navigator.geolocation.getCurrentPosition((position) => {
    userLocation.value = [position.coords.longitude, position.coords.latitude];
    centerLat = position.coords.latitude;
    centerLng = position.coords.longitude;
    console.log("HELP", userLocation.value);
  });
  map.flyTo({
    center: userLocation.value,
    zoom: 14,
    trackUserLocation: true,

    positionOptions: {
      enableHighAccuracy: true,
    },
  });
  destMarker.setLngLat(userLocation.value).addTo(map);
};

// This is toggle between car parks and erp
// Get value from child
const ERPorCarpark = (value) => {
  console.log(value);
  boolCarorERP.value = value;
  // clearMarkers();
  ERPorCarpark.value = value;

  addERPMarkers(value, boolRemoveWhenCoorChange);
  addCarParkMarkers(value, boolRemoveWhenCoorChange);
};

// When toggle update the map accordingly

/**
 * Called by Searchbar child component (signal "selected-dest") when user selects a destination
 * @param {Array} dest In the format (lng, lat)
 * @returns undefined
 */
function selectedDestination(coords) {
  const ZOOM_LEVEL = 16;

  destMarker.setLngLat(coords).addTo(map);

  map.flyTo({
    center: coords,
    zoom: ZOOM_LEVEL,
  });
  userLocation.value = coords;

  console.log("Searcvh bar chaging?", typeof coords, typeof userLocation);
}

onMounted(async () => {
  createMapInstance();
  await accessJsonERP();
  await accessJsonCar();
  // showMarkersWithinBounds();
  // addERPMarkers();
  addCarParkMarkers(boolCarorERP.value);

  //Default zoom in when loaded

  map.flyTo({
    center: userLocation.value,
    zoom: 14,
  });
  destMarker.setLngLat(userLocation.value).addTo(map);
});

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});

// When the values of ERP or Carpark coordinates changes, update the map accordingly
watch(userLocation, (newValue, oldValue) => {
  console.log("So we know?", boolCarorERP.value);
  boolRemoveWhenCoorChange.value = true;
  // console.log("User location changed:", newValue, oldValue);
  addCarParkMarkers(boolCarorERP.value, boolRemoveWhenCoorChange);
  addERPMarkers(boolCarorERP.value, boolRemoveWhenCoorChange);
});

// "mapbox://styles/ljy480/cltfztv7d00ub01nw3uhsceke/draft",
</script>

<style scoped>
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
