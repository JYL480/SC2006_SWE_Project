<template>
  <div id="map-container"></div>

  <SummarySideBar
    v-model="bookmarks"
    :carparkArray="CurrentMarkersCar"
    :erpArray="CurrentMarkersERP"
    :carparkErpSelection="boolCarOrERP"
    @emitCarParkIDHovered="emitCarParkIDHovered"
    @emitMouseCarParkOff="clearHoveredCarParkID"
    @emitERPIDHovered="emitERPIDHovered"
    @emitMouseERPOff="clearHoveredERPID"
    @bookmarksChanged="onBookmarksChanged"
  />

  <div id="searchbar">
    <Searchbar @selected-dest="selectedDestination" />
  </div>

  <Slider id="slider" @sliderValue="sliderValue"></Slider>

  <ToggleERPorCarpark @ERPorCarpark="ERPorCarpark"></ToggleERPorCarpark>
  <button id="button" class="pushable" @click="getUserLocation">
    <span class="shadow"></span>
    <span class="edge"></span>
    <span class="front"> User Location </span>
  </button>

  <Navbar @bookmark-view-toggled="toggleBookmarkMarkers"/>
</template>

<script setup>
import { currentUser } from "src/main";
import { dbGetUserBookmarks } from "src/databaselib";
import { ref, onMounted, onUnmounted, watch } from "vue";

import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import ToggleERPorCarpark from "./ToggleERPorCarpark.vue";
import Searchbar from "../components/SearchBar.vue";
import SummarySideBar from "./SummarySideBar.vue";
import Slider from "./Slider.vue";
import Navbar from "./NavBar.vue";
import { confirmPasswordReset } from "firebase/auth";

// import turf things?
import * as turf from "@turf/turf";

/**
 * @typedef {{
 *  car_park_no: string,
 *  address: string,
 *  car_park_type: string,
 *  type_of_parking_system: string,
 *  short_term_parking: string,
 *  free_parking: string,
 *  night_parking: string,
 *  car_park_decks: string,
 *  gantry_height: string,
 *  car_park_basement: string,
 *  rates: string,
 *  available_lots: string,
 *  turfpt: import"@turf/turf".Point,
 * }} Carpark
 */

/**
 * @typedef {{
 *   properties: {
 *     Name: string,
 *     price: string,
 *     Description: string,
 *   },
 *   turfpt: import"@turf/turf".Point,
 * }} ERP
 */

// const process.env.MAPBOX_TOKEN;
const MAPBOX_TOKEN = process.env.VUE_APP_MAPBOX_TOKEN;
mapboxgl.accessToken = MAPBOX_TOKEN;

// Define a ref to hold the map instance
// All the variables

// The radius variables:
// Define the radius of the circle in kilometers
const radiusInKm = ref(1);
let circleLayerId = "circle";
const radiusOptions = { steps: 50, units: "kilometers" };

const destMarker = new mapboxgl.Marker({
  color: "#008000",
  draggable: true,
  scale: 1.5,
});

let NoSlotMarker = new mapboxgl.Marker({
  color: "#00000",
  draggable: true,
  scale: 1.2,
});

const geojsonFeaturesERP = ref([]);
const geojsonFeaturesCarPark = ref([]);
// Im guessing this user Location will keep changing!!!
let userLocation = ref([103.82287200000002, 1.3649170000000002]);
let centerLat = null;
let centerLng = null;
let map = null;
let CurrentMarkersCar = ref([]);
let CurrentMarkersERP = ref([]);
let nameMarketHighlight = ref("");

// By default == true,
// True = carpark display, False, = ERP display
let boolCarOrERP = ref(true);

const bookmarks = ref({carpark: new Set(), erp: new Set()});
let isBookmarkDisplay = false; // Whether the current view is showing only bookmarks
watch(
  currentUser, // Fetch user's bookmarks whenever there is a change in user (while the sidebar is active, else bookmarks will be loaded when mounting the sidebar)
  async () => {
    if (currentUser.value) {
      console.log("Fetching bookmarks for user: " + currentUser.value.uid);
      bookmarks.value = await dbGetUserBookmarks(currentUser.value.uid);
    } else {
      console.log("Clearing Bookmarks (no user logged in)");
    }
  },
  { immediate: true }
);

function onBookmarksChanged() {   // Update markers whenever bookmarks changes when appropriate
    if (isBookmarkDisplay) {
      refreshMarkers(boolCarOrERP.value, nameMarketHighlight.value);  // TODO: Refactor to separate refreshing markers and pin dragging
    }
}


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
    const response = await fetch("erp-test.geojson");
    if (!response.ok) {
      throw new Error("Failed to fetch JSON data");
    }
    const jsonData = await response.json();
    geojsonFeaturesERP.value = jsonData.features;
    for (let i=0; i<geojsonFeaturesERP.value.length; i++) {
      geojsonFeaturesERP.value[i].turfpt = turf.point([
        geojsonFeaturesERP.value[i].geometry.coordinates[0][0],
        geojsonFeaturesERP.value[i].geometry.coordinates[1][1],
      ]);
    }
  } catch (error) {
    console.error(error);
  }
};

const accessJsonCar = async () => {
  try {
    const response = await fetch("car-updated.geojson");
    if (!response.ok) {
      throw new Error("Failed to fetch JSON data");
    }
    const jsonData = await response.json();
    geojsonFeaturesCarPark.value = jsonData;
    for (let i=0; i<geojsonFeaturesCarPark.value.length; i++) {
      geojsonFeaturesCarPark.value[i].turfpt = turf.point([
        geojsonFeaturesCarPark.value[i].Longitude,
        geojsonFeaturesCarPark.value[i].Latitude,
      ]);
    }
  } catch (error) {
    console.error(error);
  }
};

// Global Filters
// These filters are used as strategies when showing / hiding markers on the Map / Sidebar
let currentERPFilterStrategy = erpFilterUserRadius;
let currentCarparkFilterStrategy = carparkFilterUserRadius;
/**
 * @param {ERP} erp 
 */
function erpFilterUserRadius(erp) {
  const circle = turf.circle(userLocation.value, radiusInKm.value, radiusOptions);
  const pt = erp.turfpt;
  return turf.booleanPointInPolygon(pt, circle);
}

/**
 * @param {ERP} erp 
 */
function erpFilterBookmarks(erp) {
  return bookmarks.value["erp"].has(erp["properties"]["Name"]);
}

/**
 * @param {Carpark} carpark 
 */
function carparkFilterUserRadius(carpark) {
  const circle = turf.circle(userLocation.value, radiusInKm.value, radiusOptions);
  const pt = carpark.turfpt;
  return turf.booleanPointInPolygon(pt, circle);
}

/**
 * @param {Carpark} carpark 
 */
function carparkFilterBookmarks(carpark) {
  return bookmarks.value["carpark"].has(carpark["car_park_no"]);
}
// End of Global Filters

/**
 * Adds ERP markers onto the map with distance information
 * @param {Array<ERP>} erpsToMark 
 * @param {import"@turf/turf".Point} Point to calculate distance from
 */
function addERPMarkersWithDistance(erpsToMark, from) {
  for (let i=0; i<erpsToMark.length; i++) {
    const properties_name = erpsToMark[i].properties.Name;
    const properties_price = erpsToMark[i].properties.price;
    const description = erpsToMark[i].properties.Description;
    const pt = erpsToMark[i].turfpt;
    const distance = turf.distance(from, pt, { units: "kilometers" });

    const popupContent = `
    <p><strong>Address:</strong>${properties_name}</p>
    <p><strong>Price:</strong>${properties_price}</p>
    `;

    const marker = new mapboxgl.Marker({
      color: "blue",
    })
      .setLngLat([
        erpsToMark[i].geometry.coordinates[0][0],
        erpsToMark[i].geometry.coordinates[1][1],
      ])
      .setPopup(new mapboxgl.Popup().setHTML(popupContent)) // Customize popup content
      .addTo(map);
    CurrentMarkersERP.value.push([marker, erpsToMark[i], distance]);
  }
}

/**
 * To either show or hide ERP markers (+ sidebar info), can give a filtering strategy if not all ERPs will be shown
 * @param {boolean} hide Whether to show the ERP markers or hide them
 * @param {Function} erpFilterStrategy Strategy for filtering the ERP markers to show (out of all ERP markers)
 */
function showHideERPMarkers(hide, erpFilterStrategy) {
  if (hide) {
    for (let i = 0; i < CurrentMarkersERP.value.length; i++) {
      CurrentMarkersERP.value[i][0].remove();
    }
    CurrentMarkersERP.value = [];
    return;
  }

  if (!erpFilterStrategy) {
    erpFilterStrategy = () => { return true; }
  }

  const allERPs = geojsonFeaturesERP.value;    // Get all ERPs
  const from = turf.point(userLocation.value);

  const erpsToMark = allERPs.filter(erpFilterStrategy);
  addERPMarkersWithDistance(erpsToMark, from);
}

/**
 * Adds carpark markers onto the map with distance information
 * @param {Array<Carpark>} carparksToMark 
 * @param {import"@turf/turf".Point} Point to calculate distance from
 */
function addCarParkMarkerWithDistance(carparksToMark, from) {
  // Get the distance between my location to the marker
  for (let i = 0; i < carparksToMark.length; i++) {
    let marker = null;
    const carpark = carparksToMark[i]; // Current car park object
    const pt = carpark.turfpt;
    const distance = turf.distance(from, pt, { units: "kilometers" });
    const popupContent = `
      <h3>${carpark.car_park_no}</h3>
      <p><strong>Address:</strong> ${carpark.address}</p>
      <p><strong>Car Park Type:</strong> ${carpark.car_park_type}</p>
      <p><strong>Parking System:</strong> ${carpark.type_of_parking_system}</p>
      <p><strong>Short Term Parking:</strong> ${carpark.short_term_parking}</p>
      <p><strong>Free Parking:</strong> ${carpark.free_parking}</p>
      <p><strong>Night Parking:</strong> ${carpark.night_parking}</p>
      <p><strong>Car Park Decks:</strong> ${carpark.car_park_decks}</p>
      <p><strong>Gantry Height:</strong> ${carpark.gantry_height}</p>
      <p><strong>Basement:</strong> ${carpark.car_park_basement}</p>
      <p><strong>Rates:</strong> ${carpark.rates}</p>
      <p><strong>Available Slots:</strong> ${carpark.available_lots}</p>
    `;

    // console.log("?asds", highlightedName);
    if (carpark.available_lots == 0 || carpark.car_park_no == "No Data") {
      marker = new mapboxgl.Marker({
        color: "grey",
        scale: 1,
      })
        .setLngLat([carparksToMark[i].Longitude, carparksToMark[i].Latitude])
        .setPopup(new mapboxgl.Popup().setHTML(popupContent)) // Customize popup content
        .addTo(map);
      CurrentMarkersCar.value.push([marker, carparksToMark[i], distance]);
    } else {
      marker = new mapboxgl.Marker({
        color: "red",
      })
        .setLngLat([carparksToMark[i].Longitude, carparksToMark[i].Latitude])
        .setPopup(new mapboxgl.Popup().setHTML(popupContent)) // Customize popup content
        .addTo(map);
      CurrentMarkersCar.value.push([marker, carparksToMark[i], distance]);
    }
  }
}

/**
 * To either show or hide Carpark markers (+ sidebar info), can give a filtering strategy if not all carparks will be shown
 * @param {boolean} show Whether to show the carpark markers or hide them
 * @param {Function} carparkFilterStrategy Strategy for filtering the carpark markers to show (out of all carpark markers)
 */
function showHideCarparkMarkers (show, carparkFilterStrategy) {
  // This if it to remove all the markers, so if true, then add, false then remove.
  // I created 2 currentERP and Carpark arrays. That can save the markers inside.
  // So if need be i can for loop the whole thing and remove.
  if (!show) {
    for (let i = 0; i < CurrentMarkersCar.value.length; i++) {
      CurrentMarkersCar.value[i][0].remove();
    }
    CurrentMarkersCar.value = [];
    return;
  }

  if (!carparkFilterStrategy) {
    carparkFilterStrategy = () => { return true; }
  }

  combineSlotsandJson();
  const allCarparks = geojsonFeaturesCarPark.value;
  const from = turf.point(userLocation.value);

  const carparksToMark = allCarparks.filter(carparkFilterStrategy);
  addCarParkMarkerWithDistance(carparksToMark, from);
}

let prevERPFilterStrategy = null;
let prevCarparkFilterStrategy = null;
function toggleBookmarkMarkers() {
    if (isBookmarkDisplay) {
        console.log("Markers Filter Strategy: Restored");
        currentERPFilterStrategy = prevERPFilterStrategy;
        currentCarparkFilterStrategy = prevCarparkFilterStrategy;
    }
    else {
        console.log("Markers Filter Strategy: Bookmark");
        prevERPFilterStrategy = currentERPFilterStrategy;
        prevCarparkFilterStrategy = currentCarparkFilterStrategy;
        currentERPFilterStrategy = erpFilterBookmarks;
        currentCarparkFilterStrategy = carparkFilterBookmarks;
    }
    isBookmarkDisplay = !isBookmarkDisplay;
    refreshMarkers(boolCarOrERP.value, nameMarketHighlight.value);  // TODO: Refactor to separate refreshing markers and pin dragging
}

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
  boolCarOrERP.value = value;
  ERPorCarpark.value = value;

  showHideERPMarkers(value, currentERPFilterStrategy);
  showHideCarparkMarkers(value, currentCarparkFilterStrategy);
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
  radiusInKm.value = value;
  addCircle();
};

// ======================= For the hovering thing =======================
// To get the Carpark ID to pop up the HTML when hovered over the card
const carIDHovering = ref("");
const mouseOnOrOffBoolCarPark = ref(null);
const emitCarParkIDHovered = (carID, mouseOnOrOff) => {
  carIDHovering.value = carID;
  mouseOnOrOffBoolCarPark.value = mouseOnOrOff;
};

const clearHoveredCarParkID = (mouseOnOrOff) => {
  mouseOnOrOffBoolCarPark.value = mouseOnOrOff;
};

watch(
  [carIDHovering, mouseOnOrOffBoolCarPark],
  ([newID, newBool], [oldID, oldBool]) => {
    const markerToOpen = CurrentMarkersCar.value.find(
      ([marker, carPark]) => carPark.car_park_no === newID
    );
    if (!markerToOpen) {    // Occurs when attempting to close a popup that didn't exist (leaving a sidebar item without entering e.g. when unbookmarking)
      return;
    }
    const [marker, carPark, distance] = markerToOpen;
    if (newBool) {
      if (marker.togglePopup() == false) {
        marker.togglePopup();
      }
    } else if (!newBool) {
      // To close the marker

      if (marker.togglePopup() == true) {
        marker.togglePopup();
      }
    }
  }
);
//======================FOR THE ERP PART NOW ==============================

const erpIDHovering = ref("");
const mouseOnOrOffBoolERP = ref(null);
const emitERPIDHovered = (erpID, mouseOnOrOff2) => {
  erpIDHovering.value = erpID;
  mouseOnOrOffBoolERP.value = mouseOnOrOff2;
  // console.log(erpIDHovering.value);
};
const clearHoveredERPID = (mouseOnOrOff2) => {
  mouseOnOrOffBoolERP.value = mouseOnOrOff2;
  // console.log(mouseOnOrOffBoolERP.value);
};
watch(
  [erpIDHovering, mouseOnOrOffBoolERP],
  ([newID, newBool], [oldID, oldBool]) => {
    const markerToOpen = CurrentMarkersERP.value.find(
      ([marker, ERP]) => ERP.properties.Name === newID
    );
    if (!markerToOpen) {    // Occurs when attempting to close a popup that didn't exist (leaving a sidebar item without entering e.g. when unbookmarking)
      return;
    }
    // console.log(markerToOpen);
    const [marker, carPark, distance] = markerToOpen;
    // console.log(marker);
    if (newBool) {
      if (marker.togglePopup() == false) {
        marker.togglePopup();
      }
    } else if (!newBool) {
      // To close the marker

      if (marker.togglePopup() == true) {
        marker.togglePopup();
      }
    }
  }
);

// =======================================================================

onMounted(async () => {
  createMapInstance();
  await accessJsonERP();
  await accessJsonCar();
  showHideCarparkMarkers(boolCarOrERP.value, currentCarparkFilterStrategy);

  // Default zoom in when loaded
  map.flyTo({
    center: userLocation.value,
    zoom: 11,
  });

  // Add the circle representing the radius around the user's location
  // addCircle();

  setInterval(fetchDataAndWriteToFile, 60000);
  // fetchDataAndWriteToFile();
});

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});

destMarker.on("dragend", () => {
  const lngLat = destMarker.getLngLat();
  const updatedLatitude = lngLat.lat;
  const updatedLongitude = lngLat.lng;
  userLocation.value = [updatedLongitude, updatedLatitude];
});

// To add the radius thing
const addCircle = () => {
  // Will be updated with the new circle with change coordinates
  const circle = turf.circle(userLocation.value, radiusInKm.value, radiusOptions);

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
    map.getSource("circle-source").setData(circle);
  }
};

const refreshMarkers = (newBool, newName) => {
  console.log("newBool false is ERP: " + newBool);
  for (let i = 0; i < CurrentMarkersCar.value.length; i++) {
    CurrentMarkersCar.value[i][0].remove();
  }
  for (let i = 0; i < CurrentMarkersERP.value.length; i++) {
    CurrentMarkersERP.value[i][0].remove();
  }
  CurrentMarkersCar.value = [];
  CurrentMarkersERP.value = [];
  showHideCarparkMarkers(newBool, currentCarparkFilterStrategy);
  showHideERPMarkers(newBool, currentERPFilterStrategy);
  addCircle();
};

watch(
  [userLocation, radiusInKm, boolCarOrERP, nameMarketHighlight],
  (
    [newUserLocation, newRadius, newBool, newName],
    [oldUserLocation, oldRadius, oldBool, oldName]
  ) => {
    if (
      newUserLocation[0] !== oldUserLocation[0] ||
      newUserLocation[1] !== oldUserLocation[1] ||
      newRadius[0] !== oldRadius[0] ||
      newRadius[1] !== oldRadius[1] ||
      newBool[0] !== oldBool[0] ||
      newBool[1] !== oldBool[1] ||
      newName !== oldName
    ) {
      refreshMarkers(newBool, newName);
    }
    console.log("Data pulled?");
    fetchDataAndWriteToFile();
  }
  // }
);

let slotsMap = new Map();
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
      for (let item of data.items) {
        for (let carpark of item.carpark_data) {
          slotsMap.set(carpark.carpark_number, {
            availableLots: parseInt(carpark.carpark_info[0].lots_available),
          });
        }
      }
    });
};

const combineSlotsandJson = () => {
  for (const carpark of geojsonFeaturesCarPark.value) {
    const slotInfo = slotsMap.get(carpark.car_park_no);
    if (slotInfo) {
      carpark.available_lots = slotInfo.availableLots;
    } else if (
      !carpark.agency == "LTA" ||
      !carpark.agency == "URA" ||
      !carpark.available_lots
    ) {
      console.log("Hello???");
      carpark.available_lots = 0;
    }
  }
};
</script>

<style scoped>
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

#map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  /* lower z-index value than other components */
}

/* for get user location buttom*/
/* #button {
} */

#slider {
  position: relative;
  z-index: 1;
  left: 20px;
  top: 20px;
}

.pushable {
  position: fixed;
  left: 60%;
  z-index: 1; /* margin-right: 1000px; */
  bottom: 20px;
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
