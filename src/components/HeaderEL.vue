<template>
  <header>
    <div class="header_top_wrapper">
      <div class="container">
        <div class="header_top">
          <div class="header_right">
            <HeaderIcon @openmenu="isopen = true"></HeaderIcon>
            <HeaderOperation></HeaderOperation>
            <HeaderLogo></HeaderLogo>
            <HeaderSearch></HeaderSearch>
          </div>
          <div class="header_left">
            <HeaderNavigation
              @closemenu="isopen = false"
              :open="isopen"
            ></HeaderNavigation>
            <HeaderSearch></HeaderSearch>
            <HeaderAuthentication></HeaderAuthentication>
            <ShopCartEL v-if="islogin"></ShopCartEL>
          </div>
        </div>
      </div>
    </div>
    <div class="header_bottom_wrapper">
      <div class="container">
        <div :class="['header_bottom', { notlogin: !islogin }]">
          <div class="header_right">
            <HeaderMenu @closemenu="isopen = false" :open="isopen"></HeaderMenu>
            <HeaderSearch></HeaderSearch>
          </div>
          <div class="header_left">
            <HeaderAddress v-if="islogin"></HeaderAddress>
            <ShopCartEL v-else></ShopCartEL>
          </div>
        </div>
      </div>
    </div>
    <div
      @click="isopen = false"
      :class="['myoverlay', { active: isopen }]"
    ></div>
  </header>
</template>

<script setup>
import { computed, ref } from "vue";
import HeaderAuthentication from "./HeaderAuthentication.vue";
import HeaderNavigation from "./HeaderNavigation.vue";
import HeaderOperation from "./HeaderOperation.vue";
import HeaderIcon from "./HeaderIcon.vue";
import HeaderMenu from "./HeaderMenu.vue";
import HeaderLogo from "./HeaderLogo.vue";
import ShopCartEL from "./ShopCartEL.vue";
import HeaderAddress from "./HeaderAddress.vue";
import { store } from "@/data/VueX";
import HeaderSearch from "./HeaderSearch.vue";

var islogin = computed(() => store.getters.islogin);

var isopen = ref(false);
</script>

<style></style>
