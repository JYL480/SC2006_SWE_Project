<template>
  <div id="map-container"></div>
  <!-- <div id="sidebar">Longitude: -71.224518 | Latitude: 42.213995 | Zoom: 9</div>
   -->

  <SummarySideBar
    :carparkArray="CurrentMarkersCar"
    :erpArray="CurrentMarkersERP"
    :carparkErpSelection="boolCarorERP"
  />

  <div id="searchbar">
    <Searchbar @selected-dest="selectedDestination" />
  </div>
  <ToggleERPorCarpark @ERPorCarpark="ERPorCarpark"></ToggleERPorCarpark>
  <button id="button" class="pushable" @click="getUserLocation">
    <span class="shadow"></span>
    <span class="edge"></span>
    <span class="front"> User Location </span>
  </button>
  <div id="slide">
    <Slider @sliderValue="sliderValue"></Slider>
  </div>
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
import Slider from "./Slider.vue";
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
const radiusInKm = ref(1);
let circleLayerId = "circle";
const options = { steps: 50, units: "kilometers" };

const destMarker = new mapboxgl.Marker({
  color: "#008000",
  draggable: true,
});

const geojsonFeaturesERP = ref([]);
const geojsonFeaturesCarPark = ref([]);
const mapCenter = ref([103.82287200000002, 1.3649170000000002]);
const defaultLocation = [103.851784, 1.287953];
// Im guessing this user Location will keep changing!!!
let userLocation = ref([103.82287200000002, 1.3649170000000002]);
let centerLat = null;
let centerLng = null;
let map = null;
let CurrentMarkersCar = ref([]);
let CurrentMarkersERP = ref([]);

// By default == true,
// True = carpark display, False, = ERP display
let boolCarorERP = ref(true);

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
    const response = await fetch("geoJsonCarUpdated.geoJson");
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
  const circle = turf.circle(userLocation.value, radiusInKm.value, options);
  const from = turf.point(userLocation.value);
  if (remove == false) {
    const from = turf.point(userLocation.value);
    for (let i = 0; i < coor.length; i++) {
      let pt = turf.point([
        coor[i].geometry.coordinates[0][0],
        coor[i].geometry.coordinates[1][1],
      ]);
      if (turf.booleanPointInPolygon(pt, circle)) {
        properties_name = coor[i].properties.Name;
        properties_price = coor[i].properties.price;
        const distance = turf.distance(from, pt, { units: "kilometers" });

        marker = new mapboxgl.Marker({
          color: "blue",
        })
          .setLngLat([
            coor[i].geometry.coordinates[0][0],
            coor[i].geometry.coordinates[1][1],
          ])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<h3>${properties_name}</h3><p>$ ${properties_price}</p>`
            )
          ) // Customize popup content
          .addTo(map);
        CurrentMarkersERP.value.push([marker, coor[i], distance]);
      }
    }
  } else {
    for (let i = 0; i < CurrentMarkersERP.value.length; i++) {
      CurrentMarkersERP.value[i][0].remove();
    }
    CurrentMarkersERP.value = [];
  }
};

const addCarParkMarkers = (remove) => {
  combineSlotsandJson();
  const arraysCarPark = geojsonFeaturesCarPark.value;

  let properties_name = null;
  let properties_price = null;
  let marker = null;
  const circle = turf.circle(userLocation.value, radiusInKm.value, options);
  const from = turf.point(userLocation.value);

  // This if it to remove all the markers, so if true, then add, false then remove.
  // I created 2 currentERP and Carpark arrays. That can save the markers inside.
  // So if need be i can for loop the whole thing and remove.
  if (remove == true) {
    for (let i = 0; i < arraysCarPark.length; i++) {
      let pt = turf.point([
        arraysCarPark[i].Longitude,
        arraysCarPark[i].Latitude,
      ]);

      const carPark = arraysCarPark[i]; // Current car park object
      const popupContent = `
        <h3>${carPark.car_park_no}</h3>
        <p><strong>Address:</strong> ${carPark.address}</p>
        <p><strong>Car Park Type:</strong> ${carPark.car_park_type}</p>
        <p><strong>Parking System:</strong> ${carPark.type_of_parking_system}</p>
        <p><strong>Short Term Parking:</strong> ${carPark.short_term_parking}</p>
        <p><strong>Free Parking:</strong> ${carPark.free_parking}</p>
        <p><strong>Night Parking:</strong> ${carPark.night_parking}</p>
        <p><strong>Car Park Decks:</strong> ${carPark.car_park_decks}</p>
        <p><strong>Gantry Height:</strong> ${carPark.gantry_height}</p>
        <p><strong>Basement:</strong> ${carPark.car_park_basement}</p>
        <p><strong>Rates:</strong> ${carPark.rates}</p>
        <p><strong>Available Slots:</strong> ${carPark.available_lots}</p>
    `;
      if (turf.booleanPointInPolygon(pt, circle)) {
        // Get the distance between my location to the marker
        const distance = turf.distance(from, pt, { units: "kilometers" });
        properties_name = arraysCarPark[0].car_park_no;
        marker = new mapboxgl.Marker({
          color: "red",
        })
          .setLngLat([arraysCarPark[i].Longitude, arraysCarPark[i].Latitude])
          .setPopup(new mapboxgl.Popup().setHTML(popupContent)) // Customize popup content
          .addTo(map);
        CurrentMarkersCar.value.push([marker, arraysCarPark[i], distance]);
      }
    }
  } else {
    // console.log(CurrentMarkersCar.value[1]);
    for (let i = 0; i < CurrentMarkersCar.value.length; i++) {
      // console.log(CurrentMarkersCar[i].value);
      CurrentMarkersCar.value[i][0].remove();
    }
    CurrentMarkersCar.value = [];
  }
};

// To get the person's location now!!
const getUserLocation = async () => {
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    // Update userLocation and other variables
    userLocation.value = [position.coords.longitude, position.coords.latitude];
    centerLat = position.coords.latitude;
    centerLng = position.coords.longitude;

    // Now that we have the user's location, fly to it and set the marker
    map.flyTo({
      center: userLocation.value,
      zoom: 14,
      trackUserLocation: true,
      positionOptions: {
        enableHighAccuracy: true,
      },
    });
    destMarker.setLngLat(userLocation.value).addTo(map);
  } catch (error) {
    console.error("Error getting user location:", error);
  }
};

// This is toggle between car parks and erp
// Get value from child
const ERPorCarpark = (value) => {
  boolCarorERP.value = value;
  // clearMarkers();
  ERPorCarpark.value = value;

  addERPMarkers(value);
  addCarParkMarkers(value);
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
}

// Get the slider value
const sliderValue = (value) => {
  console.log(value);
  radiusInKm.value = value;
  addCircle();
};

onMounted(async () => {
  createMapInstance();
  await accessJsonERP();
  await accessJsonCar();
  addCarParkMarkers(boolCarorERP.value);

  // Default zoom in when loaded
  map.flyTo({
    center: userLocation.value,
    zoom: 11,
  });

  // Add the circle representing the radius around the user's location
  // addCircle();
  fetchDataAndWriteToFile();
});

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});

destMarker.on("dragend", () => {
  // Get the updated lngLat of the marker
  const lngLat = destMarker.getLngLat();

  // Update the latitude and longitude values
  const updatedLatitude = lngLat.lat;
  const updatedLongitude = lngLat.lng;

  // Log or use the updated latitude and longitude values as needed
  // console.log("Updated Latitude:", updatedLatitude);
  // console.log("Updated Longitude:", updatedLongitude);
  userLocation.value = [updatedLongitude, updatedLatitude];
});

// To add the radius thing
const addCircle = () => {
  // Will be updated with the new circle with change coordinates
  const circle = turf.circle(userLocation.value, radiusInKm.value, options);

  // Add the circle source and layer if they don't exist
  if (!map.getSource("circle-source")) {
    map.addSource("circle-source", {
      type: "geojson",
      data: circle,
    });

    map.addLayer({
      id: circleLayerId,
      type: "fill",
      source: "circle-source",
      layout: {},
      paint: {
        "fill-color": "blue",
        "fill-opacity": 0.1,
      },
    });
  } else {
    // Update the circle's position
    map.getSource("circle-source").setData(circle);
  }

  console.log("circle added");
};

watch(
  [userLocation, radiusInKm, boolCarorERP],
  (
    [newUserLocation, newRadius, newBool],
    [oldUserLocation, oldRadius, oldBool]
  ) => {
    if (
      newUserLocation[0] !== oldUserLocation[0] ||
      newUserLocation[1] !== oldUserLocation[1] ||
      newRadius[0] !== oldRadius[0] ||
      newRadius[1] !== oldRadius[1] ||
      newBool[0] !== oldBool[0] ||
      newBool[1] !== oldBool[1]
    ) {
      for (let i = 0; i < CurrentMarkersCar.value.length; i++) {
        CurrentMarkersCar.value[i][0].remove();
      }
      for (let i = 0; i < CurrentMarkersERP.value.length; i++) {
        CurrentMarkersERP.value[i][0].remove();
      }
      CurrentMarkersCar.value = [];
      CurrentMarkersERP.value = [];
      addCarParkMarkers(newBool);
      addERPMarkers(newBool);
      addCircle();
    }
    console.log(CurrentMarkersCar.value);
    console.log(CurrentMarkersERP.value);
  }
);

// UHH i do the thing here?
const slotsMap = new Map();

// const jsonData1 = JSON.parse(
//   fs.readFileSync("public/geoJsonCar.geojson", "utf8")
// );
const fetchDataAndWriteToFile = () => {
  fetch("https://api.data.gov.sg/v1/transport/carpark-availability")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        // Return the JSON representation of the response
        return response.json();
      }
    })
    .then((data) => {
      for (const item of data.items) {
        for (const carpark of item.carpark_data) {
          slotsMap.set(carpark.carpark_number, {
            availableLots: parseInt(carpark.carpark_info[0].lots_available),
          });
          // console.log(carpark);
        }
      }
    });

  console.log("HERE", geojsonFeaturesCarPark.value);
};

const combineSlotsandJson = () => {
  for (const carpark of geojsonFeaturesCarPark.value) {
    const slotInfo = slotsMap.get(carpark.car_park_no);
    if (slotInfo) {
      carpark.available_lots = slotInfo.availableLots;
    } else {
      carpark.available_lots = "No Data"; // Or set to some default value if slot information is not available
    }
  }
};

// "mapbox://styles/ljy480/cltfztv7d00ub01nw3uhsceke/draft",
setInterval(fetchDataAndWriteToFile, 60000);
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

.map-container {
  flex: 1;
  display: flex;
  position: relative;
}
#map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1; /* lower z-index value than other components */
}

/* for get user location buttom*/
#button {
  position: relative;
  left: 60vw;
  top: 82vh;
}
.pushable {
  position: relative;
  background: transparent;
  padding: 0px;
  border: none;
  cursor: pointer;
  outline-offset: 4px;
  outline-color: deeppink;
  transition: filter 250ms;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.shadow {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: hsl(226, 25%, 69%);
  border-radius: 8px;
  filter: blur(2px);
  will-change: transform;
  transform: translateY(2px);
  transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
}

.edge {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 8px;
  background: linear-gradient(
    to right,
    hsl(15, 100%, 47%) 0%,
    hsl(15, 39%, 49%) 8%,
    hsl(15, 39%, 39%) 92%,
    hsl(15, 39%, 29%) 100%
  );
}

.front {
  display: block;
  position: relative;
  border-radius: 8px;
  background: hsl(15, 100%, 41%);
  padding: 16px 32px;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-size: 1rem;
  transform: translateY(-4px);
  transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
}

.pushable:hover {
  filter: brightness(110%);
}

.pushable:hover .front {
  transform: translateY(-6px);
  transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
}

.pushable:active .front {
  transform: translateY(-2px);
  transition: transform 34ms;
}

.pushable:hover .shadow {
  transform: translateY(4px);
  transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
}

.pushable:active .shadow {
  transform: translateY(1px);
  transition: transform 34ms;
}

.pushable:focus:not(:focus-visible) {
  outline: none;
}
</style>

<!-- Rather than doing this, I will create a JSON file, and parsr thrufh!! -->
