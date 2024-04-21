<template>
  <input id="checkbox_toggle" type="checkbox" class="check" />
  <div class="checkbox">
    <label class="slide" for="checkbox_toggle" @click="ERPorCarpark">
      <label class="toggle" for="checkbox_toggle"></label>
      <label class="text1" for="checkbox_toggle">Car Park</label>
      <label class="text" for="checkbox_toggle">ERP</label>
    </label>
  </div>
</template>

<script setup>
import { ref, onUpdated } from "vue";

const toggle = ref(true);
const emitEvent = defineEmits(["ERPorCarpark"]);
const ERPorCarpark = () => {
  toggle.value = !toggle.value;
  emitEvent("ERPorCarpark", toggle.value);
};
</script>

<style scoped>
.checkbox {
  position: fixed;
  z-index: 1;
  bottom: 20px;
  left: 20px;
  width: 223px;
  height: 60px;
  background-color: #25232350;
  border-radius: 30px;
  color: black;
  overflow: hidden;
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 500;
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
  background: linear-gradient(40deg, #fc0404, #fa4f00d2 70%);
  transition: 0.4s;
  box-shadow:
    0px 0px 3px rgb(243, 236, 224),
    0px 0px 5px rgb(236, 236, 227);
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
  z-index: 100;
  cursor: pointer;
  text-align: center;
}

.check:checked + .checkbox .slide .toggle {
  transform: translateX(113px);
  background: linear-gradient(40deg, #8983f7, #a3dafb 70%);
  box-shadow:
    -0px -0px 10px #8983f7,
    -0px -0px 3px #8983f7;
}

.check:checked + .checkbox .slide {
  background-color: #0a192900;
  color: #050133;
}

.text1 {
  margin-right: 90px;
  z-index: 100;
}
</style>
