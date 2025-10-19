<template>
  <div class="mobilemenu">
    <ul>
      <li>
        <router-link to="/"
          ><Home></Home>
          <p>خانه</p></router-link
        >
      </li>
      <li>
        <router-link to="/categories"
          ><LayoutDashboard></LayoutDashboard>
          <p>دسته بندی</p></router-link
        >
      </li>
      <li>
        <router-link to="/products"
          ><Store></Store>
          <p>محصولات</p></router-link
        >
      </li>
      <li>
        <a href="" @click.stop.prevent="openpanel"
          ><ShoppingCart></ShoppingCart>
          <p>سبد خرید</p></a
        >
      </li>
      <li>
        <router-link :to="islogin ? { name: 'home' } : { name: 'login' }"
          ><UserRound></UserRound>
          <p>حساب کاربری</p></router-link
        >
      </li>
    </ul>
  </div>
</template>

<script setup>
import { store } from "@/data/VueX";
import { emitter } from "@/emitter/EventBus";
import {
  Home,
  LayoutDashboard,
  Store,
  ShoppingCart,
  UserRound,
} from "lucide-vue-next";
import { computed } from "vue";

var islogin = computed(() => store.getters.islogin);

function openpanel() {
  emitter.emit("openpanel");
}
</script>

<style></style>
