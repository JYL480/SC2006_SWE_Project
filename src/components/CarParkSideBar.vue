<template>
  {{ CurrentMarkersCar }}
</template>

<script setup>
const props = defineProps(["ArrayFromParent"]);
const CurrentMarkersCar = ref(props.ArrayFromParent);
console.log(CurrentMarkersCar);
</script>

<style></style>
