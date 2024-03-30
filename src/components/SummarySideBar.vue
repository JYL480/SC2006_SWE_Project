<!--html: to be mounted to html-->

<template>
  <nav class="sidebar" :class="{close:istoggle}">
    <header>
      <div class="image-text">
        <div class="text logo-text">
          <div class="SortOrderControl">
            <span class="SortOrderControl__option --isActive">Distance</span>
            <span class="SortOrderControl__option ">Price</span>
            <span class="SortOrderControl__option ">Relevance</span>
          </div>
        </div>
      </div>
      <i class="toggle" @click="toggleButton"></i>
    </header>
{{ carparkArray }}
    <div class="menu-bar">
      <div class="menu">

        <div v-show="!istoggle" class="card">
            <div class="card-details">
                <div v-show="carparkErpSelection" class="locationBox">
                    <div class="location"> location </div> 
                    <div class="slotsBox"> slots </div>           
                </div>

                <div v-show="!carparkErpSelection" class="locationBox">
                    <div>ERP name</div>         
                </div>

                <div v-show="!carparkErpSelection" class="messageBox1"> 
                    <span><b>ERP Rate</b></span>
                    <br>
                    <span>$12</span>
                </div>

                <div v-show="carparkErpSelection" class="messageBox1"> 
                    <span><b>Parking Price</b></span>
                    <br>
                    <span>$12</span>
                </div>

                <div v-show="!carparkErpSelection" class="messageBox2"> 
                    <span><b>Operating Hours</b></span>
                    <br>
                    <span>10am-7pm</span>
                </div>

                <div v-show="carparkErpSelection" class="messageBox3"> 
                    <span><b>Slots</b></span>
                    <br>
                    <span>7</span>
                </div>

                
                    
            </div>
        </div>
 
      </div>
    </div>

  </nav>

</template>

<!--Code logic: Summary Side Bar Logic here-->


<script setup>
import {ref, onMounted} from 'vue'

const props = defineProps({
  carparkArray: Array,
  erpArray: Array,
  carparkErpSelection: Boolean //True means show carpark, False means show ERP
})

var istoggle = ref(false)

function toggleButton(){
    istoggle.value = !istoggle.value;
} 


</script>



<!--CSS: Summary Side Bar Design here-->
<style>
:root {
  /* ===== Colors ===== */
  --body-color: #e4e9f7;
  --sidebar-color: #023047;
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
    color: #2963a3;
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

.sidebar header .toggle {
  position: absolute;
  top: 50%;
  right: 350px;
  transform: translateY(-50%) rotate(180deg);
  height: 0px;
  width: 0px;
  border-top: 25px solid transparent;
  border-right: 50px solid #219ebc;
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
}
.locationBox {
 width: 392px;
 height: 35px;
 border-radius: 20px 20px 0px 0px;
 background: #219ebc;
 position: relative;
 border: 2px solid #c3c6ce;
 
}

.card-details {
 color: black;
 height: 100%;
 gap: .5em;
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
    padding: 20px; /* if you want space between the images */
    text-align: center;
    margin-block-end: 1em;

}

.messageBox2 {
    box-sizing: border-box;
    float: left;
    width: 50%; 
    padding: 20px; /* if you want space between the images */
    text-align: center;
    border-left: thick double #219ebc;
}

.messageBox3 {
    box-sizing: border-box;
    float: left;
    width: 50%; 
    padding: 20px; /* if you want space between the images */
    text-align: center;
    border-left: thick double #219ebc;
}

.messageBox3 {
    box-sizing: border-box;
    float: left;
    width: 50%; 
    padding: 20px; /* if you want space between the images */
    text-align: center;
    border-left: thick double #219ebc;
}

.location {
    box-sizing: border-box;
    float: left;
    width: 80%; 
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