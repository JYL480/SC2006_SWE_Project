<template>
  <input id="checkbox_toggle" type="checkbox" class="check" />
  <div class="checkbox">
    <label class="slide" @click="ERPorCarpark" for="checkbox_toggle">
      <label class="toggle" for="checkbox_toggle"></label>
      <label class="text1" for="checkbox_toggle">Car Park</label>
      <label class="text" for="checkbox_toggle">ERP</label>
    </label>
  </div>
</template>

<script setup>
import { ref, defineEmits, onUpdated } from "vue";

const toggle = ref(true);
const emitEvent = defineEmits(["ERPorCarpark"]);
const ERPorCarpark = () => {
  toggle.value = !toggle.value;
  emitEvent("ERPorCarpark", toggle.value);
};
</script>

<style scoped>
.checkbox {
  width: 223px;
  height: 60px;
  background-color: #d0d0d0;
  border-radius: 30px;
  position: relative;
  color: black;
  overflow: hidden;
  z-index: 1;
  bottom: 580px;
}

#checkbox_toggle {
  display: none;
}

.checkbox .toggle {
  width: 100px;
  height: 50px;
  position: absolute;
  border-radius: 30px;
  left: 5px;
  cursor: pointer;
  background: linear-gradient(40deg, #ff0080, #ff8c00 70%);
  transition: 0.4s;
  box-shadow: 0px 0px 3px rgb(255, 255, 20), 0px 0px 5px rgb(255, 255, 20);
}

.checkbox .slide {
  width: 230px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.checkbox .slide .text {
  font-size: 16px;
  font-weight: 700;
  z-index: 100;
  cursor: pointer;
  text-align: center;
}

.check:checked + .checkbox .slide .toggle {
  transform: translateX(113px);
  background: linear-gradient(40deg, #8983f7, #a3dafb 70%);
  box-shadow: -0px -0px 10px #8983f7, -0px -0px 3px #8983f7;
}

.check:checked + .checkbox .slide {
  background-color: #0a1929;
  color: #fff;
}
.text1 {
  margin-right: 90px;
  z-index: 2;
  font-size: 16px;
  font-weight: 700;
}
</style>
