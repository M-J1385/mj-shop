<template>
  <div class="container">
    <ProductsFilters
      @changefilter="selectedfilter = $event"
      :activefilter="selectedfilter"
    ></ProductsFilters>
    <ProductsEL :fillter="selectedfilter"></ProductsEL>
  </div>
</template>

<script setup>
import ProductsEL from "@/components/ProductsEL.vue";
import ProductsFilters from "@/components/ProductsFilters.vue";
import { ref } from "vue";

const selectedfilter = ref("newpro");
</script>

<style></style>
