<template>
  <div
    class="login-wrapper"
    :class="{
      showlogin: showfrm == false,
      showsignup: showfrm == true,
      address: isaddress,
    }"
  >
    <router-view></router-view>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
// import LoginForm from "./LoginForm.vue";
// import SignupForm from "./SignupForm.vue";
const route = useRoute();
// const users = ref([]);

var isaddress = ref(false);

var showfrm = ref(false);

// async function fetchuser() {
//   const data = await store.dispatch("fetchuser");
//   users.value = data;
// }

onMounted(async () => {
  // fetchuser();
  if (route.name == "login") {
    showfrm.value = false;
  } else if (route.name == "signup") {
    showfrm.value = true;
  } else if (route.name == "address") {
    isaddress.value = true;
  }
});

watch(
  () => route.name,
  (newval) => {
    if (newval == "login") {
      showfrm.value = false;
    } else if (newval == "signup") {
      showfrm.value = true;
    } else if (newval == "address") {
      isaddress.value = true;
    }
  }
);
</script>

<style></style>
