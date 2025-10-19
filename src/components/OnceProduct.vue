<template>
  <router-link
    :to="{ name: 'product', params: { id: product.id, title: product.title } }"
    class="product_item"
  >
    <div class="product_image">
      <img :src="'/uploads/' + product.image" :alt="product.alt" />
    </div>
    <div class="product_title">
      <p>{{ product.title }}</p>
    </div>
    <div class="product_price">
      <p :class="{ oldprice: product.oldprice, mainprice: !product.oldprice }">
        {{ seprate(product.price) }} <span v-if="!product.oldprice">تومان</span>
      </p>
      <p :class="{ mainprice: product.oldprice }" v-if="product.oldprice">
        {{ seprate(product.oldprice) }} تومان
      </p>
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
</template>

<script setup>
import { store } from "@/data/VueX";
import { computed, defineProps, onMounted, ref } from "vue";
import { seprate } from "@/script";
import LoaderEl from "./LoaderEl.vue";

const props = defineProps(["product"]);

var loading = ref(false);

var shopcart = computed(() => store.getters.getshopcart);

async function getshopcart() {
  await store.dispatch("getshopcart");
}

onMounted(() => {
  getshopcart();
});

var isshopcart = computed(() =>
  shopcart.value.some((item) => item.id == props.product.id)
);

var shopcount = computed(
  () => shopcart.value.find((p) => p.id == props.product.id).count
);

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

async function addtoshopcart() {
  loading.value = true;
  const res = await store.dispatch("addtoshopcart", {
    product: props.product,
    count: 1,
    loading,
  });
  loading.value = res;
}
</script>

<style></style>
