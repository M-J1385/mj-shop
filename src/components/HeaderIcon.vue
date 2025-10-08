<template>
  <span @click="openmenu" class="header_icon"><i class="fa fa-bars"></i></span>
</template>

<script setup>
import { defineEmits } from "vue";
var emits = defineEmits(["openmenu"]);
function openmenu() {
  emits("openmenu");
}
</script>

<style></style>
