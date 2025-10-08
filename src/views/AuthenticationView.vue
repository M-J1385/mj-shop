<template>
  <LoginWrapper></LoginWrapper>
  <LoginImage></LoginImage>
  <LoginBackToHome></LoginBackToHome>
</template>

<script setup>
import LoginBackToHome from "@/components/LoginBackToHome.vue";
import LoginImage from "@/components/LoginImage.vue";
import LoginWrapper from "@/components/LoginWrapper.vue";
// import { store } from "@/data/VueX";
// import { gotologin, gotosignup } from "@/script";
// import { onMounted } from "vue";
// import { useRouter } from "vue-router";
// onMounted(() => {
//   var signup = document.querySelector("#signup");
//   var login = document.querySelector("#login");
//   var susername = document.querySelector("#s-username");
//   var username = document.querySelector("#username");

//   if (signup) {
//     signup.addEventListener("click", () => {
//       gotosignup();
//       susername.focus();
//     });
//   }
//   if (login) {
//     login.addEventListener("click", () => {
//       gotologin();
//       username.focus();
//     });
//   }
// });

// var user = store.getters.getuser;
// const router = useRouter();
// if (user.userlogin == true) {
//   router.push("/");
// }
</script>

<style></style>
