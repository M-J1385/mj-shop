<template>
  <div v-if="sortedpropduct.length > 0" class="products">
    <OnceProduct
      v-for="(item, index) in sortedpropduct"
      :key="index"
      :product="item"
    ></OnceProduct>
  </div>
  <div class="products notproduct" v-else><h3>محصولی وجود ندارد</h3></div>
  <div class="propagination">
    <ul>
      <li
        :class="{ active: item == currentpage }"
        @click.prevent="gotopage(item)"
        v-for="(item, index) in paginationPages"
        :key="index"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { store } from "@/data/VueX";
import OnceProduct from "./OnceProduct.vue";
import { computed, defineProps, onMounted, ref } from "vue";
import { backtotop } from "@/script";
var offers = computed(() => store.getters.getproducts);

async function getproducts() {
  await store.dispatch("getproducts");
}

const props = defineProps({
  fillter: String,
  sendcat: String,
  sendsearch: String,
});
onMounted(() => {
  getproducts();
});

const itemperpage = ref(12);
var currentpage = ref(1);

var totalpages = computed(() =>
  Math.ceil(offers.value.length / itemperpage.value)
);

const sortedpropduct = computed(() => {
  var newoffer = offers.value;
  const startindex = (currentpage.value - 1) * itemperpage.value;
  if (props.sendcat) {
    newoffer = offers.value.filter((p) => p.category == props.sendcat);
    totalpages = computed(() =>
      Math.ceil(sortedpropduct.value.length / itemperpage.value)
    );
  }
  if (props.sendsearch) {
    newoffer = offers.value.filter((p) => p.title.includes(props.sendsearch));
    totalpages = computed(() =>
      Math.ceil(sortedpropduct.value.length / itemperpage.value)
    );
  }
  if (props.fillter == "newpro") {
    return newoffer
      .sort((a, b) => b.autoid - a.autoid)
      .slice(startindex, startindex + itemperpage.value);
  } else if (props.fillter == "cheappro") {
    return newoffer
      .sort(
        (a, b) =>
          Number(a.oldprice ? a.oldprice : a.price) -
          Number(b.oldprice ? b.oldprice : b.price)
      )
      .slice(startindex, startindex + itemperpage.value);
  } else if (props.fillter == "exppro") {
    return newoffer
      .sort(
        (a, b) =>
          Number(b.oldprice ? b.oldprice : b.price) -
          Number(a.oldprice ? a.oldprice : a.price)
      )
      .slice(startindex, startindex + itemperpage.value);
  } else {
    return newoffer.slice(startindex, startindex + itemperpage.value);
  }
});

const paginationPages = computed(() => {
  const pages = [];
  const total = totalpages.value;

  if (total <= 6) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (currentpage.value <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", total);
    } else if (currentpage.value >= total - 3) {
      pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
    } else {
      pages.push(
        1,
        "...",
        currentpage.value - 1,
        currentpage.value,
        currentpage.value + 1,
        "...",
        total
      );
    }
  }

  return pages;
});

function gotopage(page) {
  if (page === "...") return;
  currentpage.value = page;
  backtotop();
}
</script>

<style></style>
