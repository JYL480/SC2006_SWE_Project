<template>
  <div id="map-container"></div>
  <!-- <div id="sidebar">Longitude: -71.224518 | Latitude: 42.213995 | Zoom: 9</div>
   -->

  <ToggleERPorCarpark @ERPorCarpark="ERPorCarpark"></ToggleERPorCarpark>
  <Searchbar @selected-dest="selectedDestination"/>
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
import ToggleERPorCarpark from "./ToggleERPorCarpark.vue";
import Searchbar from '../components/SearchBar.vue';
import { confirmPasswordReset } from "firebase/auth";

// const process.env.MAPBOX_TOKEN;
mapboxgl.accessToken =
  "pk.eyJ1IjoibGp5NDgwIiwiYSI6ImNsdGY4a2F1MjBtNzEyam45MzV5bXl1NG8ifQ.e1MgohLQEySFfrautJ_7lQ";

// Define a ref to hold the map instance
// All the variables

const destMarker = new mapboxgl.Marker({
    color: "#4F7FF0",
    draggable: true,
});

const geojsonFeaturesERP = ref([]);
const geojsonFeaturesCarPark = ref([]);
const mapCenter = ref([103.82287200000002, 1.3649170000000002]);
let userLocation = ref([]);
let centerLat = null;
let centerLng = null;
let map = null;
let CurrentMarkersCar = [];
let CurrentMarkersERP = [];

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

const addERPMarkers = (remove) => {
  const coor = geojsonFeaturesERP.value;
  let marker = null;
  let properties_name = null;
  let properties_price = null;
  if (remove == true) {
    for (let i = 0; i < coor.length; i++) {
      // console.log(
      //   coor[i].geometry.coordinates[0][0],
      //   coor[i].geometry.coordinates[1][1]
      // );
      // console.log("here1");
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
  } else {
    for (let i = 0; i < CurrentMarkersERP.length; i++) {
      CurrentMarkersERP[i].remove();
    }
  }
};
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

const addCarParkMarkers = (remove) => {
  const arraysCarPark = geojsonFeaturesCarPark.value;
  // console.log(arraysCarPark[0].car_park_no);
  let properties_name = null;
  let properties_price = null;
  let marker = null;
  // console.log(arraysCarPark[0].Longitude);
  // console.log(arraysCarPark[0].Latitude);

  // This if it to remove all the markers, so if true, then add, false then remove.
  // I created 2 currentERP and Carpark arrays. That can save the markers inside.
  // So if need be i can for loop the whole thing and remove.
  if (remove == true) {
    for (let i = 0; i < arraysCarPark.length; i++) {
      properties_name = arraysCarPark[0].car_park_no;
      // properties_price = arraysCarPark[0];
      marker = new mapboxgl.Marker({
        color: "red",
      })
        .setLngLat([arraysCarPark[i].Longitude, arraysCarPark[i].Latitude])
        .setPopup(
          // console.log()
          new mapboxgl.Popup().setHTML(`<h3>dfdfg</h3><p>$ sdf</p>`)
        ) // Customize popup content
        .addTo(map);
      CurrentMarkersCar.push(marker);
    }
  } else {
    for (let i = 0; i < CurrentMarkersCar.length; i++) {
      CurrentMarkersCar[i].remove();
    }
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

// This is toggle between car parks and erp
// Get value from child
const ERPorCarpark = (value) => {
  console.log(value);
  // clearMarkers();
  ERPorCarpark.value = value;

  addERPMarkers(!value);
  addCarParkMarkers(value);
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

// When toggle update the map accordingly

/**
 * Called by Searchbar child component (signal "selected-dest") when user selects a destination
 * @param {Array} dest In the format (lng, lat)
 * @returns undefined
 */
function selectedDestination(coords) {
    const ZOOM_LEVEL = 16;

    destMarker
        .setLngLat(coords)
        .addTo(map);

    map.flyTo({
        center: coords,
        zoom: ZOOM_LEVEL,
    });
}

onMounted(async () => {
  createMapInstance();
  await getUserLocation();
  await accessJsonERP();
  await accessJsonCar();
  // showMarkersWithinBounds();
  // addERPMarkers();
  addCarParkMarkers(true);
  map.on("load", () => {
    map.addSource("places", {
      type: "geojson",
      data: geojsonFeaturesERP.value,
    });
    map.addLayer({
      id: "places",
      type: "symbol",
      source: "places",
      layout: {
        "icon-image": "marker-15",
        "icon-allow-overlap": true,
      },
    });
  });
});

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});
// "mapbox://styles/ljy480/cltfztv7d00ub01nw3uhsceke/draft",
</script>

<style scoped>
#map-container {
  width: 100%;
  height: 100vh;
}
.map-container {
  flex: 1;
  display: flex;
  position: relative;
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
