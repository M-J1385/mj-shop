<template>
  <div :class="['login-img', { addressimg: route.name == 'address' }]">
    <img :src="imgsrc" alt="login-illustration" />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
var imgsrc = ref("/images/login-illustration.jpg");

onMounted(() => {
  if (
    route.name == "login" ||
    route.name == "auth" ||
    route.name == "mainauth"
  ) {
    imgsrc.value = "/images/login-illustration.jpg";
  } else if (route.name == "signup") {
    imgsrc.value = "/images/signup.jpg";
  } else if (route.name == "address") {
    imgsrc.value = "/images/address.png";
  }
});

watch(
  () => route.name,
  (newval) => {
    if (newval == "login") {
      imgsrc.value = "/images/login-illustration.jpg";
    } else if (newval == "signup") {
      imgsrc.value = "/images/signup.jpg";
    } else if (newval == "address") {
      imgsrc.value = "/images/address.png";
    }
  }
);
</script>

<style></style>
