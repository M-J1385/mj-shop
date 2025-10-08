<template>
  <div class="container">
    <ProductsFilters
      @changefilter="selectedfilter = $event"
      :activefilter="selectedfilter"
    ></ProductsFilters>
    <ProductsEL :sendcat="category" :fillter="selectedfilter"></ProductsEL>
  </div>
</template>

<script setup>
import ProductsEL from "@/components/ProductsEL.vue";
import ProductsFilters from "@/components/ProductsFilters.vue";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

var category = route.params.cat;

watch(
  () => route.params.cat,
  () => {
    category = route.params.cat;
  }
);

const selectedfilter = ref("newpro");
</script>

<style></style>
