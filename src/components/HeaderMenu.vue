<template>
  <ul :class="['menu', { active: props.open }]">
    <div @click="closemenu" class="header_close_btn">
      <i class="fa fa-times"></i>
    </div>
    <li id="category" class="menu_item">
      <router-link
        @click.stop.prevent="addmenuclass"
        :to="windowwidth <= 992 ? '' : '/categories'"
        class="menu_link"
        ><LayoutDashboard :size="22"></LayoutDashboard>دسته بندی ها
        <ChevronDown class="catarrow" :size="22"></ChevronDown>
      </router-link>
      <ul :class="['submenu', { active: isopen }]">
        <li v-for="(item, index) in categories" :key="index">
          <router-link
            @click="closemenu"
            :to="{ name: 'category', params: { cat: item.englishcat } }"
            >{{ item.persiancat }}</router-link
          >
        </li>
      </ul>
    </li>
    <li class="menu_item">
      <router-link @click="closemenu" to="/" class="menu_link"
        ><House class="homeicon" :size="22"></House>خانه</router-link
      >
    </li>
    <li class="menu_item">
      <router-link @click="closemenu" to="/products" class="menu_link"
        ><Store :size="22"></Store>محصولات</router-link
      >
    </li>
    <li class="menu_item">
      <router-link to="/" class="menu_link"
        ><NotebookText :size="22"></NotebookText>درباره ما</router-link
      >
    </li>
    <li class="menu_item">
      <router-link to="/" class="menu_link"
        ><Headset :size="22"></Headset>تماس با ما</router-link
      >
    </li>
    <li v-if="isadmin == true" class="menu_item">
      <router-link to="/admin" class="menu_link"
        ><ShieldUser :size="22"></ShieldUser>مدیریت</router-link
      >
    </li>
  </ul>
</template>

<script setup>
import { store } from "@/data/VueX";
import {
  House,
  Store,
  LayoutDashboard,
  Headset,
  NotebookText,
  ShieldUser,
  ChevronDown,
} from "lucide-vue-next";
import {
  computed,
  onMounted,
  defineProps,
  defineEmits,
  ref,
  onUnmounted,
} from "vue";
var emits = defineEmits(["closemenu"]);
var props = defineProps({
  open: Boolean,
});

var windowwidth = ref(window.innerWidth);

var isopen = ref(false);

var categories = computed(() => store.getters.getcategory);

async function setcategory() {
  await store.dispatch("setcategory");
}

onMounted(() => {
  setcategory();
  window.addEventListener("resize", updateWidth);
});

function updateWidth() {
  windowwidth.value = window.innerWidth;
}

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
});

var isadmin = computed(() => store.getters.isadmin);

function closemenu() {
  emits("closemenu");
}

function addmenuclass() {
  if (window.innerWidth <= 992) {
    isopen.value = !isopen.value;
  }
}
</script>

<style></style>
