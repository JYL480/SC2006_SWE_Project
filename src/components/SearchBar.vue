<template>
<div @mouseover="showDropdown=true; fetchIfRequiredRecentLocs()" @mouseleave="showDropdown=false" class="search-container">
    <div class="searchbox">
        <input @input="typingHandler" v-model="textInput" class="search-input" type="text" name="" placeholder="Search">
        <button class="search-button" href="#">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
            </svg>
        </button>
    </div>
    <div v-if="showDropdown" class="search-dropdown">
        <div v-for="location in dropdownLocations" :key="location.mapbox_id">
            <button @click="selectSuggestion(location)" class="search-suggestion">
                <div class="suggested-location-name-row">   <!-- TODO: Add Icon? -->
                    <span class="suggested-location-name"> {{ location.name }} </span>
                </div>
                <div class="suggested-location-addr"> {{ location.full_address }} </div>
            </button>
        </div>
        <!-- Clear Recent Locations Button -->
        <button v-if="!textInput.trim()" @click="clearAndUpdateRecentLocations()" class="search-suggestion">
            <div class="suggested-location-name-row">
                <span class="clear-recents">Clear Recents</span>
            </div>
        </button>
    </div>
</div>
</template>

<script setup>
    import { database } from "src/main.js";
    import { ref, computed, watch } from "vue";
    import { getDatabase, ref as dbRef, get as dbGet, set as dbSet } from "firebase/database";
    import { getAuth } from "firebase/auth";
    import { faLocationPin } from '@fortawesome/free-solid-svg-icons'

    /**
     * @typedef {{name: string, full_address: string, mapbox_id: string}} LocationDropdownItem
     */

    const emit = defineEmits([ "selected-dest" ]);   // selectedDest to be emitted with the coords of the selected location

    const MS_AFTER_TYPING = 750;
    const MAX_USER_RECENT_LOCATIONS = 5;
    const MAPBOX_TOKEN = process.env.VUE_APP_MAPBOX_TOKEN;

    const textInput = ref("");    // 2-Way Binded to search input box
    const showDropdown = ref(false);
    const suggestions = ref([]);  //ref([{"name":"Singapore Changi Airport","mapbox_id":"dXJuOm1ieHBvaTpkOWZiZDE2Yy04MWE0LTQ0NTItODM2Zi1hNTc5MGNkNTAxZjE","feature_type":"poi","address":"Airport Boulevard","full_address":"Airport Boulevard, Singapore, 819643, Singapore","place_formatted":"Singapore, 819643, Singapore","context":{"country":{"name":"Singapore","country_code":"SG","country_code_alpha_3":"SGP"},"postcode":{"id":"dXJuOm1ieHBsYzpPckt1eVE","name":"819643"},"place":{"id":"dXJuOm1ieHBsYzpJc2s","name":"Singapore"},"street":{"name":"Airport Boulevard"}},"language":"en","maki":"marker","poi_category":[],"poi_category_ids":[],"external_ids":{"iata":"SIN"},"metadata":{}},{"name":"Singapore","mapbox_id":"dXJuOm1ieHBsYzpJc2s","feature_type":"country","place_formatted":"","context":{"place":{"id":"dXJuOm1ieHBsYzpJc2s","name":"Singapore"}},"language":"en","maki":"marker","metadata":{}},{"name":"Bank Of China (singapore)","mapbox_id":"dXJuOm1ieHJldDpBcE5oSE5pejhLTkRWQTBVU2lHajVxaFhjRENYQWtRUGR3S2pyMGg4TkJFMlRMdGdtZ0RfdmMxeHBIZFRLX21rSWk1SmI2Nm43MmZUQjdVVHhzcUlWcjdkSzFnTWlTYUVvcHVYVnpMZm9obzdqN3ZWZUZCZXZqVmM2QU8wcC1fRWF0UW9nUkxQendTNzNEMlFmLU9Ud2NhLWpaVy10czFlU0lxdkFhMFFSdkVZYTExS0NJM25pSkw2MGI2TFg5U01mOGFtQjkxSXh4Z0ZYTWd1cWZOU2VfYWEtOVh5dTk4YmNEOHVISDFyS0J3TUlCMUMyX3V5dEpGUDl5MW1XcDREY2p4X0VBYUJGNkkwSG9JMnJfY0ZKMENmWlN2NHBlQjhGd09HYTdkNG1CcVNQVHRXODBiazRuTFJXcjJaTVphdmFJcDRVdzVYQnFDOE1BcUZEWkRLVTk1WWpPYmxmSGhMSzVCcWJaamxRWlJGQ0tYQ0dWOUw4bkNnNDB6bUVKTmE2bEZqUUZPOExrZllMY2NXYklnWTJNVXd0VU1yamhqeUVGalBZeGpfcHpwdlJ2YWRMQ3JMV3d1cTl1N285ZkEteFJMNWpGNEtKdHZkblRsc0xfeVhCVnNXUkJaY0poMzJhU3FSNFppWDMzVUp5SHkteTNZb0J1Qm5YYjVCQTF1QzhWazJpRndxT2RNcGVNMTdqZ3NBRnNYMHJfcTdPTXhmYVo4MDNOWTVhWnQtUkV1ckRnVW5CXzcwTDV5MmM5WWhBMkdjUERvd3RFVW9mSlktUjA0YW01a25yZnhaVFhERERWTTRxdHhYU3VMcjd4bVZyWk5uc0dnMVJxVEFHeWsxamJpa2NtVkxUel9Ld3lpUG9CeVhuTVNVMDZzMjB6Q0hSR3lMRGVWd2gxQUxHX3VzTkRkUDEycm5NZW5hWDRSSTYwbTVqYWFoWl9jWGJmc0kwdHp1YlFmQ19PSGtOaVhCaG51U3pYd1Z2aV9JN2p5SlVlUjV6Vy1PWXlFeFh2SjR3Q0Z5d2pPVU5zZWhud29UQmprVUVQdk1WOVZyZ3MwSXdfbVkwMUZwYXltc1VTRnRZU0FnY1RHQXVmYWxNZU5KVkNWcjNCVWJnb09GMVRRZ3BTVEZZYUJnUE1WLTJ4bDM1c1JYN2dKU0dJcjA0a0JKR0prZXVRRUQ0RGhPQ3NUX1Z0MUw3NXVmd2dTbndLMzFROG8wMDM4dHR3MlVEUEg2YVFIU0lfaVRYb3dHM1dxNXNHQWRBWjJCQzlZNDFoc1lWWDdyWVlaQVcwNjFVUDN0Z3hpOTZaRTUwc0pQejdWQUhSaUIxZGQtdThMdHRrYjZOWEdMOGhJc3NpM3N1d0J5VVRZQ25id185cDg4cTdvTHVJNEg1bHYwdVdNbGtMUlFCSm9HWTZnTjRZZ254V012Q2ZjeS1ZbTk3OGhTZmdlUEdtUFZVbHhUNE8xcXVUcEhiVW82UUh5Smh6YUZPVzg0SF96ZHY3dm4zd2JWMkUwbGhSWFUtTUFuMHc4M1lVNzVabE93ZnZrUnljQ0tGWVpBR045LXAzSXNvcHFVODZQNDZPTVZrd0JxcVlkQzY2WnNRNlY5ekFycG1YeUtXVndFUFg1dUhyeExfWG9QUExEZi1pRHZoVV9XNk9rUTJhU0lBeG5tZjEzRWM5MGpNTUYzeEJzWWc5V1JlWVZ1YVB2alplOEZsZVRfWjBXVThaTUJnWklFYUhBUF85X0RCb1NzeG1qaHV6NDEtbDJRSnhOdjluam5EODJtMGoyeVdfY240M1FRQkdxT19EQW51SDRVNXF3VDhUWTh2WHVVcEtrU2hDRUZSRldvX2YwejBOVmpiVkpaT09XazZaeWNyQ0dxMXhJNkdMR1JVSl90S0Zqag==","feature_type":"brand","place_formatted":"Brand","context":{},"language":"en","brand":["Bank Of China (singapore)"],"external_ids":{}},{"name":"Singapore Changi Airport (SIN)","mapbox_id":"dXJuOm1ieHBvaToxNTQ5OGJmMC01ZDU1LTQ0NTYtOTc3Yy1iNTk3NzZjYTAxMmQ","feature_type":"poi","address":"65 Airport Boulevard","full_address":"65 Airport Boulevard, Singapore, 819643, Singapore","place_formatted":"Singapore, 819643, Singapore","context":{"country":{"name":"Singapore","country_code":"SG","country_code_alpha_3":"SGP"},"postcode":{"id":"dXJuOm1ieHBsYzpPckt1eVE","name":"819643"},"place":{"id":"dXJuOm1ieHBsYzpJc2s","name":"Singapore"},"address":{"name":"65 Airport Boulevard","address_number":"65","street_name":"airport boulevard"},"street":{"name":"airport boulevard"}},"language":"en","maki":"marker","poi_category":["airport"],"poi_category_ids":["airport"],"external_ids":{"iata":"SIN","foursquare":"4b0bd124f964a520e03323e3"},"metadata":{}},{"name":"Singapore River","mapbox_id":"dXJuOm1ieHBsYzpCV3JK","feature_type":"locality","place_formatted":"Singapore, Central Singapore Community Development Council","context":{"region":{"id":"dXJuOm1ieHBsYzpSTWs","name":"Central Singapore Community Development Council","region_code":"01","region_code_full":"SG-01"},"place":{"id":"dXJuOm1ieHBsYzpJc2s","name":"Singapore"}},"language":"en","maki":"marker","metadata":{}}]);
    const recentLocations = ref([]);
    const dropdownLocations = computed(() => { return textInput.value.trim() ? suggestions.value : recentLocations.value });    // Only show recentLocations in dropdown if user is not typing

    let currentUserID = null;   // Be sure to check that this is still synced with getAuth().currentUser before doing operations that might leak other user's data
    let typingTimeout = null;   // timeoutID of the timer

    /**
     * Only fetches a user's recent locations from Firebase if there was a change in user since the last fetch
     */
    async function fetchIfRequiredRecentLocs() {
        const actualCurrentUser = getAuth().currentUser;
        if (!actualCurrentUser) {   // User isn't logged in (anymore)
            recentLocations.value = [];
        }
        else if (actualCurrentUser.uid !== currentUserID) { // Seems like there was a change in user since we last fetched
            currentUserID = actualCurrentUser.uid;
            recentLocations.value = await dbGetUserRecentLocations(actualCurrentUser.uid);
        }
    }


    /**
     * Retrieve recent locations of the currently logged in user from Database
     * @param {string} userID Unique ID of the user (i.e. as per firebase getAuth().currentUser.uid)
     * @returns {Promise<Array<LocationDropdownItem>>} Array of recent locations (e.g. both MaxBox Search Box /retrieve API format or /suggest ["properties"] should satisfy this type)
     */
    async function dbGetUserRecentLocations(userID) {
        //return [ { "address": "\"Blk 221 Boon Lay Place #02-200", "brand": [ "FairPrice" ], "brand_id": [ "fairprice" ], "context": { "address": { "address_number": "221", "id": "", "name": "\"Blk 221 Boon Lay Place #02-200, Boon Lay Shopping Complex\"", "street_name": "boon lay place #02-200" }, "country": { "country_code": "SG", "country_code_alpha_3": "SGP", "id": "", "name": "Singapore" }, "locality": { "id": "dXJuOm1ieHBsYzpBa3JK", "name": "Jurong West" }, "place": { "id": "dXJuOm1ieHBsYzpJc2s", "name": "Singapore" }, "postcode": { "id": "dXJuOm1ieHBsYzpMMnFPeVE", "name": "640221" }, "street": { "id": "", "name": "boon lay place #02-200" } }, "coordinates": { "latitude": 1.346173, "longitude": 103.712703, "routable_points": [ { "latitude": 1.3463431588240904, "longitude": 103.71295185728025, "name": "default" } ] }, "external_ids": { "foursquare": "4b867919f964a520a38b31e3", "safegraph": "zzy-22g@cdn-8pj-3yv" }, "feature_type": "poi", "full_address": "\"Blk 221 Boon Lay Place #02-200, Singapore, 640221, Singapore", "language": "en", "maki": "marker", "mapbox_id": "dXJuOm1ieHBvaTpmZTM5NjQwNi03NmQ1LTQwMGMtOTFiNS1jMzFkMWIzZGNkZTg", "metadata": { "primary_photo": "https://ir.4sqi.net/img/general/original/1251277_-J6bQRKugim7kDuA3WVSfo9zRUx5JohYg9HfwVSAsKg.jpg" }, "name": "FairPrice", "operational_status": "active", "place_formatted": "Singapore, 640221, Singapore", "poi_category": [ "grocery", "shopping" ], "poi_category_ids": [ "grocery", "shopping" ] } ];
        if (userID) {
            const userRecentLocationRef = dbRef(database, "users/" + userID + "/recent-locations");

            try {
                console.log("GET DB Recents: " + userID);
                const response = await dbGet(userRecentLocationRef);
                if (response.exists()) {
                    console.log(response.val());
                    return response.val();
                }
            } catch (e) {
                console.log(e);
                return;
            }
            return [];
        }
    }

    /**
     * Sets recent locations of the currently logged in user in Database
     * @param {Array<LocationDropdownItem>} recentLocationsArr Array of locations as per MapBox Search Box /retrieve API ['properties']
     * @param {string|null} userID Unique ID of the user (i.e. as per firebase getAuth().currentUser.uid)
     * @returns null
     */
    async function dbSetUserRecentLocations(recentLocationsArr, userID) {
        if (userID) {
            const userRecentLocationRef = dbRef(database, "users/" + userID + "/recent-locations");
            console.log("SET DB Recents: " + userID);
            try {
                await dbSet(userRecentLocationRef, recentLocationsArr);
            } catch (e) {
                console.log(e);
                return;
            }
        }
    }

    /**
     * Queries MapBox Search Box API for suggestions (each suggestion is assumed to be exactly 1 location)
     * @param {string} query        The term to query for suggestions
     * @param {string} [proximity]  Proximity bias to be used when suggesting (e.g. user's location)
     * @returns Array of suggestions
     */
    async function querySuggestions(query, proximity=undefined) {
        // Query MapBox Search Box /suggest API
        const params = new URLSearchParams({
            "q": query,
            "language": "en",
            "types": "country,region,district,postcode,locality,place,neighborhood,address,poi,street",
            "limit": 5,
            "access_token": MAPBOX_TOKEN,
            "session_token": "0c1fe5c5-4786-4718-818e-896280670cd3",
        });

        if (proximity) {
            params.set("proximity", proximity);
        }

        const response = await fetch("https://api.mapbox.com/search/searchbox/v1/suggest?" + params);
        const res_json = await response.json();

        return res_json["suggestions"]
    }

    /**
     * Queries MapBox Search Box /suggest API for suggestions after user stops typing
     * The `suggestions` ref will be updated with the suggestions
     */
    function typingHandler() {
        // Resets the timer so that only 1 timer is active
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        typingTimeout = setTimeout(async () => {    // Async because of querying for suggestions
            // Do a search request only if input box is not empty
            const inputTrimmed = (textInput.value.trim());
            if (inputTrimmed) {
                console.log("Query suggestions for: " + inputTrimmed);
                suggestions.value = await querySuggestions(inputTrimmed);
            }
        }, MS_AFTER_TYPING);
    }

    /**
     * Handler when clicking on suggested location
     * Clears the search input box & suggestions list
     *
     * @param {object} suggestion Format as specified by MapBox Search Box API
     */
    async function selectSuggestion(suggestion) {
        // Query MapBox Search Box /retrieve API
        const mapboxID = suggestion["mapbox_id"];
        const params = new URLSearchParams({
            "access_token": MAPBOX_TOKEN,
            "session_token": "0c1fe5c5-4786-4718-818e-896280670cd3",
        });
        const response = await fetch("https://api.mapbox.com/search/searchbox/v1/retrieve/" + mapboxID + "?" + params);
        const res_json = await response.json();

        if (!res_json["features"]) {
            console.error("No 'features' key on MapBox Retrieve API after User selects a suggested location");
            return;
        }

        const addedLocation = res_json["features"][0]["properties"];
        addToRecentLocations(addedLocation);    // Updates the recentLocations ref

        const actualCurrentUser = getAuth().currentUser;
        if (actualCurrentUser) {    // Updates the user's recent locations list if they are logged in
            if (actualCurrentUser.uid !== currentUserID) {
                currentUserID = null;
                console.error("User Get/Set Mismatch (Seems like the user when we requested Recent Locations from is different from the user we are setting to now). Resetting currentUserID to null");
                return;
            }
            dbSetUserRecentLocations(recentLocations.value, currentUserID);
        }

        // Reset input and suggestions list
        textInput.value = "";
        suggestions.value = [];

        // Emit signal of selected coords
        const selectedCoords = res_json["features"][0]["geometry"]["coordinates"];
        emit("selected-dest", selectedCoords);
    }

    /**
     * Does not update the database
     * @param {Array<LocationDropdownItem>} recentLocRefArr The location to be added to the recentLocations ref
     */
    function addToRecentLocations(addedLocation) {
        // Set update's recent locations
        const recentLocationsArr = recentLocations.value;
        const existingInd = recentLocationsArr.findIndex((location) => {return location["mapbox_id"] === addedLocation["mapbox_id"]});   // .value due to Deep Reactivity
        if (existingInd != -1) {
            recentLocationsArr.splice(existingInd, 1);
        }
        recentLocationsArr.unshift(addedLocation);
        recentLocationsArr.length = Math.min(recentLocationsArr.length, MAX_USER_RECENT_LOCATIONS);
    }

    /**
     * Clears the recent locations list and update the user's database
     */
    function clearAndUpdateRecentLocations() {
        if (recentLocations.value.length == 0) {
            return;
        }

        recentLocations.value = [];

        const actualCurrentUser = getAuth().currentUser;
        if (actualCurrentUser) {    // Updates the user's recent locations list if they are logged in
            if (actualCurrentUser.uid !== currentUserID) {
                currentUserID = null;
                console.error("User Get/Set Mismatch (Seems like the user when we requested Recent Locations from is different from the user we are setting to now). Resetting currentUserID to null");
                return;
            }
            dbSetUserRecentLocations(recentLocations.value, currentUserID);
        }
    }

</script>

<style>

.search-container {
    position: absolute;
    top: 10px;
    left: 55vw;
}

.search-container:hover > .searchbox > .search-input {
    width: 240px;
    padding: 0 6px;
}

.search-container:hover > .searchbox > .search-button {
    border: none;
}

.searchbox {
    background: white; /* #2f3640; */
    height: 30px;
    border-radius: 40px;
    padding: 10px;
}

.search-button {
    color: #2f3640;
    float: right;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.4s;
}

.search-input {
    border:none;
    background: none;
    outline:none;
    float:left;
    padding: 0;
    font-size: 16px;
    transition: 0.4s;
    line-height: 30px;
    width: 0px;
}

.search-dropdown {
    position: relative;
    top: 0.5rem;
    color: #2e2e2f;
    cursor: default;
    background-color: #fff;
    padding: 0.2rem;
    border-radius: 8px;
    box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
    margin-bottom: 1rem;
    border: 3px dashed transparent;
    max-width: 350px;
}

.search-suggestion {
    border: none;
    background: transparent;
    color: #2e2e2e;
    width: 100%;
    padding: 0.2rem;
    border-radius: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
}

.search-suggestion:hover {
    background: #f3f3f3;
}

.suggested-location-name-row {
    display: flex;
}

.suggested-location-name {
    flex: 1;
    font-weight: bold;
    text-align: left;
}

.suggested-location-addr {
    text-align: left;
}

.clear-recents {
    color: #707070;
}

@media screen and (max-width: 620px) {
    .search-container:hover > .search-input {
        width: 150px;
        padding: 0 6px;
    }
}

</style>
