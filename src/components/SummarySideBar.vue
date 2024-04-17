<!--html: to be mounted to html-->

<template>
  <nav class="sidebar" :class="{ close: istoggle }">
    <header>
      <div class="image-text">
        <div class="text logo-text">
          <div v-show="carparkErpSelection" class="SortOrderControl">
            <span
              v-if="!distanceButtonIsClicked"
              @click="distanceButton"
              class="SortOrderControl__option"
            >
              Distance
            </span>

            <span v-else class="SortOrderControl__option --isActive">
              <b>Distance</b>
            </span>

            <span
              v-if="!priceButtonIsClicked"
              @click="priceButton"
              class="SortOrderControl__option"
            >
              Price
            </span>

            <span v-else class="SortOrderControl__option --isActive">
              <b>Price</b>
            </span>

            <span
              v-if="!slotsButtonIsClicked"
              @click="slotsButton"
              class="SortOrderControl__option"
            >
              Slots
            </span>

            <span v-else class="SortOrderControl__option --isActive">
              <b>Slots</b>
            </span>
          </div>

          <div v-show="!carparkErpSelection" class="SortOrderControl">
            <span
              v-if="!distanceButtonIsClicked"
              @click="distanceButton"
              class="SortOrderControl__option"
            >
              Distance
            </span>

            <span v-else class="SortOrderControl__option --isActive">
              <b>Distance</b>
            </span>
            <!--
            <span v-if="!priceButtonIsClicked"
                  @click="priceButton"
                  class="SortOrderControl__option">
              Price
            </span>

            <span v-else class="SortOrderControl__option --isActive">
              <b>Price</b>
            </span>

            <span v-if="!slotsButtonIsClicked"
                  @click="slotsButton"
                  class="SortOrderControl__option">
              Slots
            </span>

            <span v-else class="SortOrderControl__option --isActive">
              <b>Slots</b>
            </span>
          --></div>
        </div>
      </div>
      <i class="toggle" @click="toggleButton"></i>
    </header>
    <div class="menu-bar">
      <div class="menu">
        <!--Very disgusting repetative code, maybe can change later after all functional requirements are done-->
        <div
          v-show="!istoggle && carparkErpSelection"
          v-for="carpark in carparkArray"
          class="card"
        >
          <div
            class="card-details"
            @mouseover="emitCarParkIDHovered(carpark[1].car_park_no)"
            @mouseleave="clearHoveredCarParkID"
          >
            <div class="locationBox">
              <div class="location">Location: {{ carpark[1].address }}</div>
              <label class="ui-bookmark">
                <input
                  :checked="bookmarkedCarparks.has(carpark[1]['car_park_no'])"
                  @change="carparkBookmarkToggle(carpark[1])"
                  type="checkbox"
                />
                <div class="bookmark">
                  <svg viewBox="0 0 32 32">
                    <g>
                      <path
                        d="M27 4v27a1 1 0 0 1-1.625.781L16 24.281l-9.375 7.5A1 1 0 0 1 5 31V4a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4z"
                      ></path>
                    </g>
                  </svg>
                </div>
              </label>
            </div>

            <div class="messageBox1">
              <span>
                <u><b>Parking Information</b></u>
              </span>

              <br />
              <span> <b>Rate:</b> ${{ carpark[1].rates }} </span>

              <br />
              <span>
                <b>Night Parking:</b>
                {{ carpark[1].night_parking.toLowerCase() }}
              </span>

              <br />
              <span>
                <b>Free Parking:</b> {{ carpark[1].free_parking.toLowerCase() }}
              </span>
            </div>

            <div class="messageBox3">
              <span> <b>Distance: </b> {{ carpark[2].toFixed(3) }}km </span>

              <br />
              <span> <b>Slots: </b> {{ carpark[1].available_lots }} </span>

              <br />
              <span>
                <div class="btn-conteiner">
                  <a
                    class="btn-content"
                    @click="
                      openDirections(carpark[1].Latitude, carpark[1].Longitude)
                    "
                  >
                    <span class="btn-title">Directions</span>
                    <span class="icon-arrow">
                      <svg
                        width="66px"
                        height="28px"
                        viewBox="0 0 66 43"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                      >
                        <g
                          id="arrow"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          <path
                            id="arrow-icon-one"
                            d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"
                            fill="#FFFFFF"
                          ></path>

                          <path
                            id="arrow-icon-two"
                            d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
                            fill="#FFFFFF"
                          ></path>

                          <path
                            id="arrow-icon-three"
                            d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z"
                            fill="#FFFFFF"
                          ></path>
                        </g>
                      </svg>
                    </span>
                  </a>
                </div>
              </span>
            </div>
          </div>
        </div>

        <div
          v-show="!istoggle && !carparkErpSelection"
          v-for="erp in erpArray"
          class="card"
        >
          <!--v-for="erp in erpArray"-->
          <div
            class="card-details"
            @mouseover="emitERPIDHovered(erp[1].properties.Name)"
            @mouseleave="clearHoveredERPID"
          >
            <div class="ERPlocationBox">
              <div class="location">ERP Name: {{ erp[1].properties.Name }}</div>
              <label class="ui-bookmark">
                <input
                  :checked="bookmarkedERP.has(erp[1].properties.Name)"
                  @change="erpBookmarkToggle(erp[1])"
                  type="checkbox"
                />
                <div class="bookmark">
                  <svg viewBox="0 0 32 32">
                    <g>
                      <path
                        d="M27 4v27a1 1 0 0 1-1.625.781L16 24.281l-9.375 7.5A1 1 0 0 1 5 31V4a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4z"
                      ></path>
                    </g>
                  </svg>
                </div>
              </label>
            </div>

            <div class="messageBox1">
              <span> <b>ERP Price </b>${{ erp[1].properties.price }} </span>
              <br />
              <span>
                ERP is <b>{{ erp[2].toFixed(3) }}km</b> away
              </span>
            </div>

            <div class="messageBox2">
              <span>
                <b>Operating Hours</b>
              </span>

              <br />
              <span> 10am-7pm </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<!--Code logic: Summary Side Bar Logic here-->

<script setup>
import { database, currentUser } from "src/main.js";
import { ref, watch, defineEmits } from "vue";
import { ref as dbRef, get as dbGet, set as dbSet } from "firebase/database";

const props = defineProps({
  carparkArray: Array,
  erpArray: Array,
  carparkErpSelection: Boolean, //True means show carpark, False means show ERP
});
//====================== EMIT CARID HOVERING THING car park!! =================================
const emit = defineEmits([
  "emitCarParkIDHovered",
  "emitMouseCarParkOff",
  "emitERPIDHovered",
  "emitMouseERPOff",
]);

const mouseOnOrOffCarpark = ref(false);
const mouseOnOrOffERP = ref(false);

const emitCarParkIDHovered = (carparkID) => {
  mouseOnOrOffCarpark.value = true;
  emit("emitCarParkIDHovered", carparkID, mouseOnOrOffCarpark.value);
};

const clearHoveredCarParkID = () => {
  mouseOnOrOffCarpark.value = false;
  emit("emitMouseCarParkOff", mouseOnOrOffCarpark.value);
};

// ===================== EMIT ERP THING =========================================

const emitERPIDHovered = (erpID) => {
  mouseOnOrOffERP.value = true;
  console.log(erpID);
  emit("emitERPIDHovered", erpID, mouseOnOrOffERP.value);
};

const clearHoveredERPID = () => {
  mouseOnOrOffERP.value = false;
  console.log(mouseOnOrOffERP.value);
  emit("emitMouseERPOff", mouseOnOrOffERP.value);
};

// =================================================================================

var istoggle = ref(false);
var distanceButtonIsClicked = ref(false);
var priceButtonIsClicked = ref(false);
var slotsButtonIsClicked = ref(false);

function toggleButton() {
  istoggle.value = !istoggle.value;
}

function distanceButton() {
  distanceButtonIsClicked.value = !toggleButton.value;
  if (distanceButtonIsClicked) {
    priceButtonIsClicked.value = false;
    slotsButtonIsClicked.value = false;
    //Sort carpark array by distance

    //comparator function
    function compareDistance(a, b) {
      if (a[2] < b[2]) {
        return -1;
      } else if (b[2] < a[2]) {
        return 1;
      } else {
        return 0;
      }
    }

    if (props.carparkErpSelection) {
      props.carparkArray.sort(compareDistance);
    } else {
      props.erpArray.sort(compareDistance);
    }
  }
}

function priceButton() {
  priceButtonIsClicked.value = !priceButtonIsClicked.value;
  if (priceButtonIsClicked) {
    distanceButtonIsClicked.value = false;
    slotsButtonIsClicked.value = false;

    function compareCarparkRates(a, b) {
      if (a[1].rates < b[1].rates) {
        return -1;
      } else if (b[1].rates < a[1].rates) {
        return 1;
      } else {
        return 0;
      }
    }

    function compareERPPrice(a, b) {
      if (a[1].properties.price < b[1].properties.price) {
        return -1;
      } else if (b[1].properties.price < a[1].properties.price) {
        return 1;
      } else {
        return 0;
      }
    }
    if (props.carparkErpSelection) {
      props.carparkArray.sort(compareCarparkRates);
    } else {
      props.erpArray.sort(compareERPPrice);
    }
  }
}

function slotsButton() {
  slotsButtonIsClicked.value = !slotsButtonIsClicked.value;
  if (slotsButtonIsClicked) {
    distanceButtonIsClicked.value = false;
    priceButtonIsClicked.value = false;
  }
  function compareSlots(a, b) {
    if (a[1].available_lots > b[1].available_lots) {
      return -1;
    } else if (b[1].available_lots > a[1].available_lots) {
      return 1;
    } else {
      return 0;
    }
  }
  props.carparkArray.sort(compareSlots);
}

// THis is the getDirections part!!
const openDirections = (lat, long) => {
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${long}`;
  window.open(googleMapsUrl, "_blank");
};

// Bookmark Stuff -----------------------------------------------
let bookmarkedCarparks = ref(new Set());
let bookmarkedERP = ref(new Set());

watch(
  currentUser, // Fetch user's bookmarks whenever there is a change in user (while the sidebar is active, else bookmarks will be loaded when mounting the sidebar)
  async () => {
    if (currentUser.value) {
      console.log("Fetching bookmarks for user: " + currentUser.value.uid);
      const bookmarks = await dbGetUserBookmarks(currentUser.value.uid);
      bookmarkedCarparks.value = bookmarks["carpark"];
      bookmarkedERP.value = bookmarks["erp"];
    } else {
      console.log("Clearing Bookmarks (no user logged in)");
      bookmarkedCarparks.value = new Set();
      bookmarkedERP.value = new Set();
    }
  },
  { immediate: true }
);

/**
 * Retrieve recent locations of the currently logged in user from Database
 * @param {string} userID Unique ID of the user (i.e. as per firebase getAuth().currentUser.uid)
 * @returns {Promise<{carpark: Set<string>, erp: Set<string>}>} Object with .carpark and .erp, each being an Set of the bookmarked IDs
 */
async function dbGetUserBookmarks(userID) {
  let bookmarkArrays = null;
  if (userID) {
    const userBookmarksRef = dbRef(database, "users/" + userID + "/bookmarks");

    try {
      console.log("GET DB Bookmarks: " + userID);
      const response = await dbGet(userBookmarksRef);
      if (response.exists()) {
        console.log(response.val());
        bookmarkArrays = response.val(); // DB can only store JSON, Sets are not supported in JSON
      }
    } catch (e) {
      console.log(e);
      return;
    }
  }

  if (bookmarkArrays) {
    return {
      carpark: new Set(bookmarkArrays["carpark"]),
      erp: new Set(bookmarkArrays["erp"]),
    };
  } else {
    return {
      carpark: new Set(),
      erp: new Set(),
    };
  }
}

/**
 * Sets bookmarks of the currently logged in user in Database
 * @param {Set<string>} carparkBookmarkSet Set of bookmarked Carpark IDs
 * @param {Set<string>} erpBookmarkSet Set of IDs bookmarked ERP IDs
 * @param {string|null} userID Unique ID of the user (i.e. as per firebase getAuth().currentUser.uid)
 */
async function dbSetBookmarks(carparkBookmarksSet, erpBookmarkSet, userID) {
  const bookmarks = {
    carpark: [...carparkBookmarksSet],
    erp: [...erpBookmarkSet],
  }; // JSON doesn't support Set, just Array
  if (userID) {
    const userBookmarksRef = dbRef(database, "users/" + userID + "/bookmarks");
    console.log("SET DB Bookmarks: " + userID);
    try {
      await dbSet(userBookmarksRef, bookmarks);
    } catch (e) {
      console.log(e);
      return;
    }
  }
}

/**
 * @param {{car_park_no: string}} carparkDetails Where the .car_park_no gives the unique ID of the carpark
 */
function carparkBookmarkToggle(carparkDetails) {
  const carparkID = carparkDetails["car_park_no"];
  if (bookmarkedCarparks.value.has(carparkID)) {
    bookmarkedCarparks.value.delete(carparkID);
    console.log("Removed Carpark Bookmark: " + carparkID);
  } else {
    bookmarkedCarparks.value.add(carparkID);
    console.log("Added Carpark Bookmark: " + carparkID);
  }

  if (currentUser.value) {
    dbSetBookmarks(
      bookmarkedCarparks.value,
      bookmarkedERP.value,
      currentUser.value.uid
    );
  }
}

/**
 * @param {{properties: {Name: string}}} erpDetails Where the .properties.Name gives the unique ID of the ERP
 */
function erpBookmarkToggle(erpDetails) {
  const erpID = erpDetails["properties"]["Name"];
  if (bookmarkedERP.value.has(erpID)) {
    bookmarkedERP.value.delete(erpID);
    console.log("Removed ERP Bookmark: " + erpID);
  } else {
    bookmarkedERP.value.add(erpID);
    console.log("Added ERP Bookmark: " + erpID);
  }

  if (currentUser.value) {
    dbSetBookmarks(
      bookmarkedCarparks.value,
      bookmarkedERP.value,
      currentUser.value.uid
    );
  }
}
// End of Bookmark Stuff ----------------------------------------
</script>

``
<!--CSS: Summary Side Bar Design here-->
<style>
:root {
  /* ===== Colors ===== */
  --body-color: #e4e9f7;
  --sidebar-color: #413535ce;
  --primary-color: #695cfe;
  --primary-color-light: #f6f5ff;
  --toggle-color: #ddd;
  --text-color: #7f8081;

  /* ====== Transition ====== */
  --tran-03: all 0.2s ease;
  --tran-03: all 0.3s ease;
  --tran-04: all 0.3s ease;
  --tran-05: all 0.3s ease;

  --font: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

/* ===== Sidebar ===== */
.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 400px;
  overflow-y: hidden;
  padding: 10px 14px;
  background: var(--sidebar-color);
  transition: var(--tran-05);
}
.sidebar.close {
  right: -350px;
}

/* ===== Reusable code - Here ===== */
.sidebar li {
  height: 50px;
  list-style: none;
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.sidebar header .image,
.sidebar .icon {
  min-width: 60px;
  border-radius: 6px;
}

.sidebar .icon {
  min-width: 60px;
  border-radius: 6px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.sidebar .text,
.sidebar .icon {
  color: var(--text-color);
  transition: var(--tran-03);
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.sidebar .text {
  font-size: 17px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 1;
}
.sidebar.close .text {
  opacity: 0;
}
/* =========================== */

.sidebar header {
  position: relative;
}

.sidebar header .image-text {
  display: flex;
  align-items: center;
}
.sidebar header .logo-text {
  display: flex;
  flex-direction: column;
}

.SortOrderControl {
  padding-left: 45px;
  color: #ddd;
  font-size: 1.6rem;
}

.SortOrderControl__option {
  display: inline-block;
  padding: 4px 16px;
  border-right: 1px solid #1d0404;
  cursor: pointer;
}

.SortOrderControl__option.\--isActive {
  color: #131414;
  cursor: default;
}

header .image-text .name {
  padding-left: 60px;
  margin-top: 2px;
  font-size: 30px;
  font-weight: 600;
}

header .image-text .profession {
  font-size: 16px;
  margin-top: -2px;
  display: block;
}

.sidebar header .image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar header .image img {
  width: 40px;
  border-radius: 6px;
}
/* Button to open and close the sidebar*/
.sidebar header .toggle {
  position: absolute;
  top: 50%;
  right: 350px;
  transform: translateY(-50%) rotate(180deg);
  height: 0px;
  width: 0px;
  border-top: 25px solid transparent;
  border-right: 50px solid #ffffff;
  border-bottom: 25px solid transparent;
  border-radius: 5px;
  /*background-color: var(--primary-color);*/
  color: var(--sidebar-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  cursor: pointer;
  transition: var(--tran-05);
}

.sidebar.close .toggle {
  transform: translateY(-50%) rotate(0deg);
}

.sidebar .menu {
  margin-top: 40px;
}

.sidebar li a {
  list-style: none;
  height: 100%;
  background-color: transparent;
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  border-radius: 6px;
  text-decoration: none;
  transition: var(--tran-03);
}

.sidebar li a:hover {
  background-color: var(--primary-color);
}
.sidebar li a:hover .icon,
.sidebar li a:hover .text {
  color: var(--sidebar-color);
}
body.dark .sidebar li a:hover .icon,
body.dark .sidebar li a:hover .text {
  color: var(--text-color);
}

.sidebar .menu-bar {
  height: calc(100% - 55px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: scroll;
}
.menu-bar::-webkit-scrollbar {
  display: none;
}
.sidebar .menu-bar .mode {
  border-radius: 6px;
  background-color: var(--primary-color-light);
  position: relative;
  transition: var(--tran-05);
}

.menu-bar .mode .sun-moon {
  height: 50px;
  width: 60px;
}

.mode .sun-moon i {
  position: absolute;
}
.mode .sun-moon i.sun {
  opacity: 0;
}
body.dark .mode .sun-moon i.sun {
  opacity: 1;
}
body.dark .mode .sun-moon i.moon {
  opacity: 0;
}

.menu-bar .bottom-content .toggle-switch {
  position: absolute;
  right: 0;
  height: 100%;
  min-width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
}
.toggle-switch .switch {
  position: relative;
  height: 22px;
  width: 40px;
  border-radius: 25px;
  background-color: var(--toggle-color);
  transition: var(--tran-05);
}

/* For ListItens using cards */
.card {
  width: 395px;
  height: 130px;
  border-radius: 20px;
  background: #f5f5f5;
  position: relative;
  border: 2px solid #000000;
  transition: 0.5s ease-out;
  overflow: visible;
  margin-bottom: 25px;
  transition: border-width 0.3s;
}
.locationBox {
  width: 392px;
  height: 35px;
  border-radius: 20px 20px 0px 0px;
  background: #bc2121;
  position: relative;
  border: 2px solid #000000;
}

.ERPlocationBox {
  width: 392px;
  height: 35px;
  border-radius: 20px 20px 0px 0px;
  background: #219ebc;
  position: relative;
  border: 2px solid #c3c6ce;
  margin-bottom: 20px;
}

.card-details {
  color: black;
  height: 100%;
  gap: 0.5em;
  place-content: center;
}

/*Hover*/
.card:hover {
  border-color: #ff9a9a;
  border-width: 5px;
  box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.25);
}

.messageBox1 {
  box-sizing: border-box;
  float: left;
  width: 50%;
  padding-bottom: 35px;
  padding-top: 5px;
  padding-left: 9px;
  text-align: left;
  font-family: var(--font);
  /*margin-block-end: 1em;*/
}

.messageBox2 {
  box-sizing: border-box;
  float: left;
  width: 50%;
  padding-bottom: 10px;
  text-align: center;
  border-left: thick double #000000;
  font-family: var(--font);
}

.messageBox3 {
  box-sizing: border-box;
  float: left;
  width: 50%;
  height: 100px;
  padding: 20px; /* if you want space between the images */
  text-align: left;
  border-left: thick double #000000;
  font-family: var(--font);
}

.location {
  box-sizing: border-box;
  float: left;
  margin-left: 5px;
  margin-top: 5px;
  padding: 5px; /* if you want space between the images */
  overflow-x: hidden;
  font-family: var(--font);
  font-weight: 600;
  font-size: 14px;
  height: 20px;
  width: 355px;
  text-align: left;
  color: #ffffff;
}

.slotsBox {
  box-sizing: border-box;
  float: left;
  width: 20%;
  padding: 5px; /* if you want space between the images */
}
.btn-conteiner {
  display: flex;
  justify-content: center;
  cursor: pointer;

  --color-text: #ffffff;
  --color-background: #ff135a;
  --color-outline: #ff145b80;
  --color-shadow: #00000080;
}

.btn-content {
  display: flex;
  align-items: center;
  padding: 0px 5px 0px;
  text-decoration: none;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: var(--color-text);
  background: var(--color-background);
  transition: 1s;
  border-radius: 100px;
  box-shadow: 0 0 0.2em 0 var(--color-background);
  margin-right: 30px;
  margin-top: 10px;
}

.btn-content:hover,
.btn-content:focus {
  transition: 0.5s;
  -webkit-animation: btn-content 1s;
  animation: btn-content 1s;
  outline: 0.1em solid transparent;
  outline-offset: 0.2em;
  box-shadow: 0 0 0.4em 0 var(--color-background);
}

.btn-content .icon-arrow {
  transition: 0.5s;
  margin-right: 0px;
  transform: scale(0.6);
}

.btn-content:hover .icon-arrow {
  transition: 0.5s;
  margin-right: 25px;
}

.icon-arrow {
  width: 20px;
  margin-left: 15px;
  position: relative;
  top: 6%;
}

/* SVG */
#arrow-icon-one {
  transition: 0.4s;
  transform: translateX(-60%);
}

#arrow-icon-two {
  transition: 0.5s;
  transform: translateX(-30%);
}

.btn-content:hover #arrow-icon-three {
  animation: color_anim 1s infinite 0.2s;
}

.btn-content:hover #arrow-icon-one {
  transform: translateX(0%);
  animation: color_anim 1s infinite 0.6s;
}

.btn-content:hover #arrow-icon-two {
  transform: translateX(0%);
  animation: color_anim 1s infinite 0.4s;
}

/* SVG animations */
@keyframes color_anim {
  0% {
    fill: white;
  }

  50% {
    fill: var(--color-background);
  }

  100% {
    fill: white;
  }
}

/* Button animations */
@-webkit-keyframes btn-content {
  0% {
    outline: 0.2em solid var(--color-background);
    outline-offset: 0;
  }
}

@keyframes btn-content {
  0% {
    outline: 0.2em solid var(--color-background);
    outline-offset: 0;
  }
}

/* For BookMark */

.ui-bookmark {
  --icon-size: 24px;
  --icon-secondary-color: rgb(77, 77, 77);
  --icon-hover-color: rgb(97, 97, 97);
  --icon-primary-color: gold;
  --icon-circle-border: 1px solid var(--icon-primary-color);
  --icon-circle-size: 35px;
  --icon-anmt-duration: 0.3s;
}

.ui-bookmark input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  display: none;
}

.ui-bookmark .bookmark {
  width: var(--icon-size);
  height: auto;
  fill: var(--icon-secondary-color);
  cursor: pointer;
  -webkit-transition: 0.2s;
  -o-transition: 0.2s;
  transition: 0.2s;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  position: relative;
  -webkit-transform-origin: top;
  -ms-transform-origin: top;
  transform-origin: top;
  margin-top: 5px;
}

.bookmark::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  -webkit-box-shadow: 0 30px 0 -4px var(--icon-primary-color),
    30px 0 0 -4px var(--icon-primary-color),
    0 -30px 0 -4px var(--icon-primary-color),
    -30px 0 0 -4px var(--icon-primary-color),
    -22px 22px 0 -4px var(--icon-primary-color),
    -22px -22px 0 -4px var(--icon-primary-color),
    22px -22px 0 -4px var(--icon-primary-color),
    22px 22px 0 -4px var(--icon-primary-color);
  box-shadow: 0 30px 0 -4px var(--icon-primary-color),
    30px 0 0 -4px var(--icon-primary-color),
    0 -30px 0 -4px var(--icon-primary-color),
    -30px 0 0 -4px var(--icon-primary-color),
    -22px 22px 0 -4px var(--icon-primary-color),
    -22px -22px 0 -4px var(--icon-primary-color),
    22px -22px 0 -4px var(--icon-primary-color),
    22px 22px 0 -4px var(--icon-primary-color);
  border-radius: 50%;
  -webkit-transform: scale(0);
  -ms-transform: scale(0);
  transform: scale(0);
}

.bookmark::before {
  content: "";
  position: absolute;
  border-radius: 50%;
  border: var(--icon-circle-border);
  opacity: 0;
}

/* actions */

.ui-bookmark:hover .bookmark {
  fill: var(--icon-hover-color);
}

.ui-bookmark input:checked + .bookmark::after {
  -webkit-animation: circles var(--icon-anmt-duration)
    cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  animation: circles var(--icon-anmt-duration)
    cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  -webkit-animation-delay: var(--icon-anmt-duration);
  animation-delay: var(--icon-anmt-duration);
}

.ui-bookmark input:checked + .bookmark {
  fill: var(--icon-primary-color);
  -webkit-animation: bookmark var(--icon-anmt-duration) forwards;
  animation: bookmark var(--icon-anmt-duration) forwards;
  -webkit-transition-delay: 0.3s;
  -o-transition-delay: 0.3s;
  transition-delay: 0.3s;
}

.ui-bookmark input:checked + .bookmark::before {
  -webkit-animation: circle var(--icon-anmt-duration)
    cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  animation: circle var(--icon-anmt-duration)
    cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  -webkit-animation-delay: var(--icon-anmt-duration);
  animation-delay: var(--icon-anmt-duration);
}

@-webkit-keyframes bookmark {
  50% {
    -webkit-transform: scaleY(0.6);
    transform: scaleY(0.6);
  }

  100% {
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
  }
}

@keyframes bookmark {
  50% {
    -webkit-transform: scaleY(0.6);
    transform: scaleY(0.6);
  }

  100% {
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
  }
}
</style>
