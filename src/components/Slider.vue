<template>
  <div class="PB-range-slider-div">
    <input
      type="range"
      min="1"
      max="5"
      value="1"
      v-model="sliderValue"
      class="PB-range-slider"
      id="myRange"
      @input="slider"
    />
    <p class="PB-range-slidervalue">{{ sliderValue }}KM</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
const sliderValue = ref(1);
const emitEvent = defineEmits(["sliderValue"]);
const slider = () => {
  emitEvent("sliderValue", sliderValue.value);
};
</script>

<style scoped>
.PB-range-slider {
  width: 100%;
  height: 4px;
  border-radius: 5px;
  background: #d5dbe1;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}

.PB-range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #000000;
  cursor: pointer;
  transition: 0.3s ease-in-out;
}

.PB-range-slider::-webkit-slider-thumb:hover {
  box-shadow: 0px 0px 0px 8px rgba(0, 0, 0, 0.16);
  transition: 0.3s ease-in-out;
}

.PB-range-slider::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #000000;
  cursor: pointer;
}

.PB-range-slider-div {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 10px;
  border: 1px solid #c6cace;
  box-shadow: 0px 1px 2px 0px #1f1e241f;
  background-color: #c72a2a6b;
  width: 150px;
}

.PB-range-slidervalue {
  font-family: "Poppins", sans-serif;
  font-weight: 600;
}

</style>
