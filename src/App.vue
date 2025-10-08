<template>
  <router-view></router-view>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { store } from "./data/VueX";

const user = computed(() => store.getters.getuser);

onMounted(() => {
  if (user.value == null) {
    store.commit("setuser", {
      userlogin: false,
      username: "",
      useradmin: false,
    });
  }
});
</script>

<style></style>
