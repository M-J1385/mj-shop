<template>
  <div class="offer_card">
    <router-link :to="{ name: 'product', params: { id, title } }">
      <div class="card_image">
        <slot name="image"></slot>
      </div>
      <div class="card_title">
        <p>{{ title }}</p>
      </div>
      <div class="card_price">
        <slot name="price"></slot>
      </div>
      <div v-if="isshopcart" class="input-number">
        <i @click.prevent.stop="plusnumber()" class="fa fa-plus"></i>
        <input
          v-model="shopcount"
          type="number"
          min="1"
          :max="product.proqty"
          readonly
          name="procount"
          id="procount"
        />
        <i @click.prevent.stop="minusnumber()" class="fa fa-minus"></i>
      </div>
      <div v-else class="product_add_btn">
        <button
          v-if="product.proqty > 0"
          @click.prevent="addtoshopcart"
          type="button"
        >
          <p v-if="loading == false">افزودن به سبد</p>
          <i v-if="loading == false" class="fa fa-circle-plus"></i>
          <LoaderEl v-if="loading == true"></LoaderEl>
        </button>
        <h3 class="notqty" v-else>ناموجود</h3>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { store } from "@/data/VueX";
import { computed, defineProps, ref } from "vue";
import LoaderEl from "./LoaderEl.vue";

var shopcart = computed(() => store.getters.getshopcart);

var loading = ref(false);

var shopcount = computed(
  () => shopcart.value.find((p) => p.id == props.product.id).count
);

const props = defineProps({
  id: Number,
  title: String,
  product: Object,
});

var isshopcart = computed(() =>
  shopcart.value.some((item) => item.id == props.product.id)
);

async function addtoshopcart() {
  loading.value = true;
  const res = await store.dispatch("addtoshopcart", {
    product: props.product,
    count: 1,
    loading,
  });
  loading.value = res;
}

async function plusnumber() {
  if (shopcart.value) {
    var current = shopcart.value.find((p) => p.id == props.product.id);
    await store.dispatch("plusshopcount", current.id);
    await store.dispatch("updateqty", current.id);
    await store.dispatch("getproducts");
  }
}

async function minusnumber() {
  if (shopcart.value) {
    var current = shopcart.value.find((p) => p.id == props.product.id);
    await store.dispatch("minusshopcart", current.id);
    await store.dispatch("updateqty", current.id);
    await store.dispatch("getproducts");
  }
}
</script>

<style></style>
