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
              >Distance</span
            >
            <span v-else class="SortOrderControl__option --isActive"
              ><b>Distance</b></span
            >

            <span
              v-if="!priceButtonIsClicked"
              @click="priceButton"
              class="SortOrderControl__option"
              >Price</span
            >
            <span v-else class="SortOrderControl__option --isActive"
              ><b>Price</b></span
            >

            <span
              v-if="!slotsButtonIsClicked"
              @click="slotsButton"
              class="SortOrderControl__option"
              >Slots</span
            >
            <span v-else class="SortOrderControl__option --isActive"
              ><b>Slots</b></span
            >
          </div>

          <div v-show="!carparkErpSelection" class="SortOrderControl">
            <span
              v-if="!distanceButtonIsClicked"
              @click="distanceButton"
              class="SortOrderControl__option"
              >Distance</span
            >
            <span v-else class="SortOrderControl__option --isActive"
              ><b>Distance</b></span
            >

            <span
              v-if="!priceButtonIsClicked"
              @click="priceButton"
              class="SortOrderControl__option"
              >Price</span
            >
            <span v-else class="SortOrderControl__option --isActive"
              ><b>Price</b></span
            >

            <span
              v-if="!slotsButtonIsClicked"
              @click="slotsButton"
              class="SortOrderControl__option"
              >Slots</span
            >
            <span v-else class="SortOrderControl__option --isActive"
              ><b>Slots</b></span
            >
          </div>
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
          <div class="card-details">
            <div class="locationBox">
              <div class="location">Location: {{ carpark[1].address }}</div>
            </div>

            <div class="messageBox1">
              <span
                ><u><b>Parking Information</b></u></span
              >
              <br />
              <span><b>Rate:</b>${{ carpark[1].rates }}</span>
              <br />
              <span
                ><b>Night Parking:</b>
                {{ carpark[1].night_parking.toLowerCase() }}</span
              >
              <br />
              <span
                ><b>Free Parking:</b>
                {{ carpark[1].free_parking.toLowerCase() }}</span
              >
            </div>

            <div class="messageBox3">
              <span><b>Distance: </b>{{ carpark[2].toFixed(3) }}km</span>
              <br />
              <span><b>Slots: </b> {{ carpark[1].available_lots }}</span>
            </div>
          </div>
        </div>

        <div
          v-show="!istoggle && !carparkErpSelection"
          v-for="erp in erpArray"
          class="card"
        >
          <!--v-for="erp in erpArray"-->
          <div class="card-details">
            <div class="ERPlocationBox">
              <div class="location">ERP Name: {{ erp[1].properties.Name }}</div>
            </div>

            <div class="messageBox1">
              <span><b>ERP Price </b>${{ erp[1].properties.price }}</span>
              <br />
              <span
                >ERP is <b>{{ erp[2].toFixed(3) }}km</b> away</span
              >
            </div>

            <div class="messageBox2">
              <span><b>Operating Hours</b></span>
              <br />
              <span>10am-7pm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<!--Code logic: Summary Side Bar Logic here-->

<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  carparkArray: Array,
  erpArray: Array,
  carparkErpSelection: Boolean, //True means show carpark, False means show ERP
});

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
}
</script>

``
<!--CSS: Summary Side Bar Design here-->
<style>
:root {
  /* ===== Colors ===== */
  --body-color: #e4e9f7;
  --sidebar-color: #706c6c;
  --primary-color: #695cfe;
  --primary-color-light: #f6f5ff;
  --toggle-color: #ddd;
  --text-color: #7f8081;

  /* ====== Transition ====== */
  --tran-03: all 0.2s ease;
  --tran-03: all 0.3s ease;
  --tran-04: all 0.3s ease;
  --tran-05: all 0.3s ease;
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
  border-right: 1px solid #ddd;
  cursor: pointer;
}

.SortOrderControl__option.\--isActive {
  color: #131414;
  cursor: default;
}
/*
.LocationListItem {
    box-shadow: 0 2px 5px 0 rgba(0,0,0,.3);
    border-radius: 4px;
    display: block;
    width: 100%;
    background-color: #fff;
    position: relative;
    margin-bottom: 8px;
    transition: all .1s ease-in-out;
}

.LocationListItem__containerLink {
    display: block;
    color: #555;
    text-decoration: none;
    cursor: pointer;
    zoom: 1;
}

.LocationListItem__title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    color: #fff;
    text-align: left;
    font-size: 1.8rem;
    font-family: museo_sans, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;
    -ms-flex: 1;
    flex: 1;
}

.LocationListItem__containerLink:before {
    content: " ";
    display: table;
}

.LocationListItem__titleBar {
    border-radius: 4px 4px 0 0;
    padding: 6px 12px;
    width: 100%;
    background: #2963a3;
    align-items: center;
}

.LocationListItem__titleBar.\--offStreet {
    background: #2963a3;
}

.LocationListItem__capacity {
    padding-left: 16px;
    color: #fff;
    font-size: 1.4rem;
    line-height: 1;
}

.LocationListItem__searchDetails {
    margin: 8px 0;
    margin-top: 8px;
    margin-right: 0px;
    margin-bottom: 8px;
    margin-left: 0px;
}

.LocationDetailsSearchDetails {
    display: -ms-flexbox;
    display: flex;
}

.LocationDetailsSearchDetails__detail {
    -ms-flex: 1;
    flex: 1;
    text-align: center;
}

.LocationDetailsSearchDetails__detail__value {
    font-size: 3rem;
}

.LocationDetailsSearchDetails__detail__label {
    display: block;
    font-size: 1.6rem;
}

.LocationDetailsSearchDetails__detail__value.\--small {
    font-size: 1.8rem;
}

.LocationDetailsSearchDetails__detail__label {
    display: block;
    font-size: 1.6rem;
}*/

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
  border: 2px solid #c3c6ce;
  transition: 0.5s ease-out;
  overflow: visible;
  margin-bottom: 25px;
}
.locationBox {
  width: 392px;
  height: 35px;
  border-radius: 20px 20px 0px 0px;
  background: #219ebc;
  position: relative;
  border: 2px solid #c3c6ce;
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
  border-color: #008bf8;
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
  /*margin-block-end: 1em;*/
}

.messageBox2 {
  box-sizing: border-box;
  float: left;
  width: 50%;
  padding-bottom: 10px;
  text-align: center;
  border-left: thick double #219ebc;
}

.messageBox3 {
  box-sizing: border-box;
  float: left;
  width: 50%;
  height: 100px;
  padding: 20px; /* if you want space between the images */
  text-align: left;
  border-left: thick double #219ebc;
}

.location {
  box-sizing: border-box;
  float: left;
  margin-left: 5px;
  padding: 5px; /* if you want space between the images */
  overflow: hidden;
}

.slotsBox {
  box-sizing: border-box;
  float: left;
  width: 20%;
  padding: 5px; /* if you want space between the images */
}
</style>
