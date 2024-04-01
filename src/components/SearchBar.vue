<template>
<div class="searchbox">
    <input @input="typingHandler" v-model="textInput" class="search-input" type="text" name="" placeholder="Search">
    <button class="search-button" href="#">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
        </svg>
    </button>
    <div v-if="textInput.trim()" class="search-dropdown">
        <div v-for="suggestion in suggestions">
            <button @click="selectSuggestion(suggestion)" class="search-suggestion">
                <div class="suggested-location-name-row">   <!-- TODO: Add Icon -->
                    <span class="suggested-location-name"> {{ suggestion.name }} </span>
                </div>
                <div class="suggested-location-addr"> {{ suggestion.full_address }} </div>
            </button>
        </div>
    </div>
</div>
</template>

<script setup>
    import { ref } from "vue";
    import { faLocationPin } from '@fortawesome/free-solid-svg-icons'

    const emit = defineEmits([ "selected-dest" ]);   // selectedDest to be emitted with the coords of the selected location

    const MS_AFTER_TYPING = 750;
    const MAPBOX_TOKEN = process.env.VUE_APP_MAPBOX_TOKEN;

    const textInput = ref("");    // 2-Way Binded to search input box
    const suggestions = ref([]); //ref([{"name":"Singapore Changi Airport","mapbox_id":"dXJuOm1ieHBvaTpkOWZiZDE2Yy04MWE0LTQ0NTItODM2Zi1hNTc5MGNkNTAxZjE","feature_type":"poi","address":"Airport Boulevard","full_address":"Airport Boulevard, Singapore, 819643, Singapore","place_formatted":"Singapore, 819643, Singapore","context":{"country":{"name":"Singapore","country_code":"SG","country_code_alpha_3":"SGP"},"postcode":{"id":"dXJuOm1ieHBsYzpPckt1eVE","name":"819643"},"place":{"id":"dXJuOm1ieHBsYzpJc2s","name":"Singapore"},"street":{"name":"Airport Boulevard"}},"language":"en","maki":"marker","poi_category":[],"poi_category_ids":[],"external_ids":{"iata":"SIN"},"metadata":{}},{"name":"Singapore","mapbox_id":"dXJuOm1ieHBsYzpJc2s","feature_type":"country","place_formatted":"","context":{"place":{"id":"dXJuOm1ieHBsYzpJc2s","name":"Singapore"}},"language":"en","maki":"marker","metadata":{}},{"name":"Bank Of China (singapore)","mapbox_id":"dXJuOm1ieHJldDpBcE5oSE5pejhLTkRWQTBVU2lHajVxaFhjRENYQWtRUGR3S2pyMGg4TkJFMlRMdGdtZ0RfdmMxeHBIZFRLX21rSWk1SmI2Nm43MmZUQjdVVHhzcUlWcjdkSzFnTWlTYUVvcHVYVnpMZm9obzdqN3ZWZUZCZXZqVmM2QU8wcC1fRWF0UW9nUkxQendTNzNEMlFmLU9Ud2NhLWpaVy10czFlU0lxdkFhMFFSdkVZYTExS0NJM25pSkw2MGI2TFg5U01mOGFtQjkxSXh4Z0ZYTWd1cWZOU2VfYWEtOVh5dTk4YmNEOHVISDFyS0J3TUlCMUMyX3V5dEpGUDl5MW1XcDREY2p4X0VBYUJGNkkwSG9JMnJfY0ZKMENmWlN2NHBlQjhGd09HYTdkNG1CcVNQVHRXODBiazRuTFJXcjJaTVphdmFJcDRVdzVYQnFDOE1BcUZEWkRLVTk1WWpPYmxmSGhMSzVCcWJaamxRWlJGQ0tYQ0dWOUw4bkNnNDB6bUVKTmE2bEZqUUZPOExrZllMY2NXYklnWTJNVXd0VU1yamhqeUVGalBZeGpfcHpwdlJ2YWRMQ3JMV3d1cTl1N285ZkEteFJMNWpGNEtKdHZkblRsc0xfeVhCVnNXUkJaY0poMzJhU3FSNFppWDMzVUp5SHkteTNZb0J1Qm5YYjVCQTF1QzhWazJpRndxT2RNcGVNMTdqZ3NBRnNYMHJfcTdPTXhmYVo4MDNOWTVhWnQtUkV1ckRnVW5CXzcwTDV5MmM5WWhBMkdjUERvd3RFVW9mSlktUjA0YW01a25yZnhaVFhERERWTTRxdHhYU3VMcjd4bVZyWk5uc0dnMVJxVEFHeWsxamJpa2NtVkxUel9Ld3lpUG9CeVhuTVNVMDZzMjB6Q0hSR3lMRGVWd2gxQUxHX3VzTkRkUDEycm5NZW5hWDRSSTYwbTVqYWFoWl9jWGJmc0kwdHp1YlFmQ19PSGtOaVhCaG51U3pYd1Z2aV9JN2p5SlVlUjV6Vy1PWXlFeFh2SjR3Q0Z5d2pPVU5zZWhud29UQmprVUVQdk1WOVZyZ3MwSXdfbVkwMUZwYXltc1VTRnRZU0FnY1RHQXVmYWxNZU5KVkNWcjNCVWJnb09GMVRRZ3BTVEZZYUJnUE1WLTJ4bDM1c1JYN2dKU0dJcjA0a0JKR0prZXVRRUQ0RGhPQ3NUX1Z0MUw3NXVmd2dTbndLMzFROG8wMDM4dHR3MlVEUEg2YVFIU0lfaVRYb3dHM1dxNXNHQWRBWjJCQzlZNDFoc1lWWDdyWVlaQVcwNjFVUDN0Z3hpOTZaRTUwc0pQejdWQUhSaUIxZGQtdThMdHRrYjZOWEdMOGhJc3NpM3N1d0J5VVRZQ25id185cDg4cTdvTHVJNEg1bHYwdVdNbGtMUlFCSm9HWTZnTjRZZ254V012Q2ZjeS1ZbTk3OGhTZmdlUEdtUFZVbHhUNE8xcXVUcEhiVW82UUh5Smh6YUZPVzg0SF96ZHY3dm4zd2JWMkUwbGhSWFUtTUFuMHc4M1lVNzVabE93ZnZrUnljQ0tGWVpBR045LXAzSXNvcHFVODZQNDZPTVZrd0JxcVlkQzY2WnNRNlY5ekFycG1YeUtXVndFUFg1dUhyeExfWG9QUExEZi1pRHZoVV9XNk9rUTJhU0lBeG5tZjEzRWM5MGpNTUYzeEJzWWc5V1JlWVZ1YVB2alplOEZsZVRfWjBXVThaTUJnWklFYUhBUF85X0RCb1NzeG1qaHV6NDEtbDJRSnhOdjluam5EODJtMGoyeVdfY240M1FRQkdxT19EQW51SDRVNXF3VDhUWTh2WHVVcEtrU2hDRUZSRldvX2YwejBOVmpiVkpaT09XazZaeWNyQ0dxMXhJNkdMR1JVSl90S0Zqag==","feature_type":"brand","place_formatted":"Brand","context":{},"language":"en","brand":["Bank Of China (singapore)"],"external_ids":{}},{"name":"Singapore Changi Airport (SIN)","mapbox_id":"dXJuOm1ieHBvaToxNTQ5OGJmMC01ZDU1LTQ0NTYtOTc3Yy1iNTk3NzZjYTAxMmQ","feature_type":"poi","address":"65 Airport Boulevard","full_address":"65 Airport Boulevard, Singapore, 819643, Singapore","place_formatted":"Singapore, 819643, Singapore","context":{"country":{"name":"Singapore","country_code":"SG","country_code_alpha_3":"SGP"},"postcode":{"id":"dXJuOm1ieHBsYzpPckt1eVE","name":"819643"},"place":{"id":"dXJuOm1ieHBsYzpJc2s","name":"Singapore"},"address":{"name":"65 Airport Boulevard","address_number":"65","street_name":"airport boulevard"},"street":{"name":"airport boulevard"}},"language":"en","maki":"marker","poi_category":["airport"],"poi_category_ids":["airport"],"external_ids":{"iata":"SIN","foursquare":"4b0bd124f964a520e03323e3"},"metadata":{}},{"name":"Singapore River","mapbox_id":"dXJuOm1ieHBsYzpCV3JK","feature_type":"locality","place_formatted":"Singapore, Central Singapore Community Development Council","context":{"region":{"id":"dXJuOm1ieHBsYzpSTWs","name":"Central Singapore Community Development Council","region_code":"01","region_code_full":"SG-01"},"place":{"id":"dXJuOm1ieHBsYzpJc2s","name":"Singapore"}},"language":"en","maki":"marker","metadata":{}}]);

    let typingTimeout = null;    // timeoutID of the timer

    /**
     * Queries MapBox Search Box API for suggestions (each suggestion is assumed to be exactly 1 location)
     * @param {string} query        The term to query for suggestions
     * @param {string} [proximity]  Proximity bias to be used when suggesting (e.g. user's location)
     * @returns List of suggestions
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
     * Handler for clicking on suggested location
     * Also clears the search input box & suggestions list
     * @param {object} suggestion Format as specified by MapBox Search Box API
     * @returns undefined
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

        const selectedCoords = res_json["features"][0]["geometry"]["coordinates"];

        textInput.value = "";
        suggestions.value = [];

        emit("selected-dest", selectedCoords);
    }
</script>

<style>

.searchbox {
    position: absolute;
    top: 0;
    left: 55vw;
    transform:  translate(0%,100%);
    background:#2f3640;
    height: 30px;
    border-radius: 40px;
    padding: 10px;
}

.searchbox:hover > .search-input {
    width: 240px;
    padding: 0 6px;
}

.searchbox:hover > .search-button {
  background: white;
  color : #2f3640;
}

.search-button {
    color: white;
    float: right;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #2f3640;
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
    color: white;
    font-size: 16px;
    transition: 0.4s;
    line-height: 30px;
    width: 0px;
}

.search-dropdown {
    position: relative;
    color: #2e2e2f;
    cursor: default;
    background-color: #fff;
    padding: 0.2rem;
    border-radius: 8px;
    box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
    margin-top: 3rem;
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

.suggested-location-icon {
    flex: none;
    width: 1.5rem;
}

.suggested-location-name {
    flex: 1;
    font-weight: bold;
    text-align: left;
}

.suggested-location-addr {
    text-align: left;
}

@media screen and (max-width: 620px) {
    .searchbox:hover > .search-input {
        width: 150px;
        padding: 0 6px;
    }
}

</style>
