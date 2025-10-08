<template>
  <div class="container">
    <h3 class="search_title">جستجو برای : {{ search }}</h3>
    <ProductsFilters
      @changefilter="selectedfilter = $event"
      :activefilter="selectedfilter"
    ></ProductsFilters>
    <ProductsEL :sendsearch="search" :fillter="selectedfilter"></ProductsEL>
  </div>
</template>

<script setup>
import ProductsEL from "@/components/ProductsEL.vue";
import ProductsFilters from "@/components/ProductsFilters.vue";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const selectedfilter = ref("newpro");

const route = useRoute();

var search = route.query.q;

watch(
  () => route.query.q,
  () => {
    search = route.query.q;
  }
);
</script>

<style></style>
