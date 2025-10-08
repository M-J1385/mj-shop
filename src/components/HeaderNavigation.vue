<template>
  <nav>
    <HeaderLogoVue></HeaderLogoVue>
    <HeaderMenuVue @closemenu="closemenu" :open="props.open"></HeaderMenuVue>
  </nav>
</template>

<script setup>
import HeaderLogoVue from "./HeaderLogo.vue";
import HeaderMenuVue from "./HeaderMenu.vue";
import { defineProps, defineEmits } from "vue";
var emits = defineEmits(["closemenu"]);
var props = defineProps({
  open: Boolean,
});

function closemenu() {
  emits("closemenu");
}
</script>

<style></style>
