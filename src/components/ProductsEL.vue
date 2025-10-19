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
import { computed, defineProps, onMounted, ref, watch } from "vue";
import { backtotop } from "@/script";
import { useRoute, useRouter } from "vue-router";

var offers = computed(() => store.getters.getproducts);

async function getproducts() {
  await store.dispatch("getproducts");
}

const route = useRoute();
const router = useRouter();

const props = defineProps({
  fillter: String,
  sendcat: String,
  sendsearch: String,
});

onMounted(() => {
  getproducts();
});

const itemperpage = ref(12);
const currentpage = ref(Number(route.query.page) || 1);

var totalpages = computed(() =>
  Math.ceil(filterproduct.value.length / itemperpage.value)
);

const filterproduct = computed(() => {
  var newoffer = offers.value;

  if (props.sendcat) {
    newoffer = offers.value.filter((p) => p.category == props.sendcat);
  }
  if (props.sendsearch) {
    newoffer = offers.value.filter((p) => p.title.includes(props.sendsearch));
  }

  return newoffer;
});

const sortedpropduct = computed(() => {
  const startindex = (currentpage.value - 1) * itemperpage.value;

  var newoffer = [...filterproduct.value];

  if (props.fillter == "newpro") {
    newoffer.sort((a, b) => b.autoid - a.autoid);
  } else if (props.fillter == "cheappro") {
    newoffer.sort(
      (a, b) =>
        Number(a.oldprice ? a.oldprice : a.price) -
        Number(b.oldprice ? b.oldprice : b.price)
    );
  } else if (props.fillter == "exppro") {
    newoffer.sort(
      (a, b) =>
        Number(b.oldprice ? b.oldprice : b.price) -
        Number(a.oldprice ? a.oldprice : a.price)
    );
  } else {
    return newoffer;
  }

  return newoffer.slice(startindex, startindex + itemperpage.value);
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

watch(
  () => route.query.page,
  (newPage) => {
    if (!newPage) {
      currentpage.value = 1;
    } else {
      currentpage.value = Number(newPage);
    }
  }
);

function gotopage(page) {
  if (page === "...") return;
  currentpage.value = page;
  router.push({
    query: { ...route.query, page: page },
  });
  backtotop();
}
</script>

<style></style>
