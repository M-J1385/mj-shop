<template>
  <HeaderEL v-if="!isauth && !isnotfound"></HeaderEL>
  <main>
    <router-view></router-view>
  </main>
  <FooterEL v-if="!isauth && !isnotfound"></FooterEL>
  <MobileMenu v-if="!isauth && !isnotfound"></MobileMenu>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed, watch } from "vue";
import HeaderEL from "@/components/HeaderEL.vue";
import FooterEL from "@/components/FooterEL.vue";
import MobileMenu from "@/components/MobileMenu.vue";
const isauth = computed(
  () =>
    route.name === "auth" ||
    route.name === "mainauth" ||
    route.name === "login" ||
    route.name === "signup" ||
    route.name === "address"
);
const isnotfound = computed(() => route.name === "notfound");

const route = useRoute();
watch(
  () => route.name,
  (newRoute) => {
    if (
      newRoute === "auth" ||
      newRoute === "mainauth" ||
      newRoute === "login" ||
      newRoute === "signup" ||
      newRoute === "address"
    ) {
      document.body.className = "auth";
    } else {
      document.body.className = "index";
    }
  },
  { immediate: true }
);
</script>

<style></style>
