<template>
  <div :class="['login-img', { addressimg: route.name == 'address' }]">
    <img :src="imgsrc" alt="login-illustration" />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
var imgsrc = ref("");

onMounted(() => {
  if (
    route.name == "login" ||
    route.name == "auth" ||
    route.name == "mainauth"
  ) {
    imgsrc.value = "../../public/images/login-illustration.jpg";
  } else if (route.name == "signup") {
    imgsrc.value = "../../public/images/signup.jpg";
  } else if (route.name == "address") {
    imgsrc.value = "../../public/images/address.png";
  }
});

watch(
  () => route.name,
  (newval) => {
    if (newval == "login") {
      imgsrc.value = "../../public/images/login-illustration.jpg";
    } else if (newval == "signup") {
      imgsrc.value = "../../public/images/signup.jpg";
    } else if (newval == "address") {
      imgsrc.value = "../../public/images/address.png";
    }
  }
);
</script>

<style></style>
