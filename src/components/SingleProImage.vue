<template>
  <div class="proimage" v-if="product">
    <VueMagnifier
      :src="'/uploads/' + product.image"
      mg-width="250"
      mg-height="250"
      zoom-factor="0.5"
    />
  </div>
</template>

<script setup>
import { store } from "@/data/VueX";
import VueMagnifier from "@websitebeaver/vue-magnifier";
import "@websitebeaver/vue-magnifier/styles.css";
import { computed, onMounted, ref, watch } from "vue";
var offers = ref([]);
import { useRoute } from "vue-router";
const route = useRoute();
const proid = computed(() => route.params.id);
const product = ref(null);

watch(proid, () => {
  getproducts();
});

async function getproducts() {
  await store.dispatch("getproducts");
  offers.value = store.getters.getproducts;

  product.value = offers.value.find((p) => p.id == proid.value);
}

onMounted(() => {
  getproducts();
});
</script>

<style></style>
