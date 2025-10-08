<template>
  <div class="category_wrapper">
    <div class="category" v-for="(item, index) in categories" :key="index">
      <router-link :to="{ name: 'category', params: { cat: item.englishcat } }"
        ><img
          :src="'../../public/images/' + item.englishcat + '.jpg'"
          :alt="item.englishcat"
      /></router-link>
    </div>
  </div>
</template>

<script setup>
import { store } from "@/data/VueX";
import { computed } from "vue";

const categories = computed(() => store.getters.getcategory);
</script>

<style></style>
