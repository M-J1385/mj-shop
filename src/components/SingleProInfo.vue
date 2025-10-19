<template>
  <div class="proinformation" v-if="product">
    <h1 class="protitle">{{ product.title }}</h1>
    <h4 class="procategory">
      دسته بندی :
      <router-link
        :to="{ name: 'category', params: { cat: product.category } }"
        >{{ product.category }}</router-link
      >
    </h4>
    <div class="attributes">
      <div class="attritem" v-for="(item, index) in skills" :key="index">
        <p>{{ item.skillname }}</p>
        <p>{{ item.skillvalue }}</p>
      </div>
    </div>
    <h4 class="proqty">
      موجودی :
      <span :class="{ lowqty: product.proqty <= 1 }">{{ qty }}</span>
    </h4>
    <h3 :class="{ oldprice: product.oldprice }">
      {{ seprate(product.price) }}
      <span v-if="!product.oldprice">تومان</span>
    </h3>
    <h3 v-if="product.oldprice">{{ seprate(product.oldprice) }} تومان</h3>
    <div class="input-number">
      <i @click="plusnumber(shopcart?.id)" class="fa fa-plus"></i>
      <input
        v-model="shopcount"
        type="number"
        min="1"
        :max="product.proqty"
        readonly
        name="procount"
        id="procount"
      />
      <i @click="minusnumber(shopcart?.id)" class="fa fa-minus"></i>
    </div>
    <div class="probtn">
      <button
        v-if="containshop"
        :disabled="product.proqty == 0"
        @click="addtocard"
        type="button"
        class="addtocard"
      >
        <p v-if="loading == false">افزودن به سبد خرید</p>
        <i v-if="loading == false" class="fa fa-circle-plus"></i>
        <LoaderEl v-if="loading == true"></LoaderEl>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { store } from "@/data/VueX";
import { seprate } from "@/script";
import LoaderEl from "./LoaderEl.vue";
// var offers = ref(computed(() => store.getters.getproducts));
const route = useRoute();

// var containshop = computed(() => {
//   if (shopcart.value.id == proid.value) {
//     return false;
//   } else {
//     return true;
//   }
// });

var loading = ref(false);

const proid = computed(() => route.params.id);

var product = computed(() =>
  store.getters.getproducts.find((p) => p.id == proid.value)
);
var shopcart = computed(() =>
  store.getters.getshopcart.find((p) => p.id == proid.value)
);

var shopcount = computed(() => {
  if (shopcart.value) {
    return shopcart.value.count;
  } else {
    return procount.value;
  }
});

watch(proid, () => {
  getproducts();
});

const procount = ref(1);
const skills = ref([]);

async function getproducts() {
  await store.dispatch("getproducts");
  await store.dispatch("getshopcart");
  const attr = await store.dispatch("getskills", proid.value);
  skills.value = attr;
}

onMounted(() => {
  getproducts();
});

async function plusnumber(id) {
  if (shopcart.value) {
    await store.dispatch("plusshopcount", id);
    await store.dispatch("updateqty", id);
    await store.dispatch("getproducts");
  } else {
    if (procount.value < product.value.proqty) {
      procount.value += 1;
    }
  }
}

async function minusnumber(id) {
  if (shopcart.value) {
    await store.dispatch("minusshopcart", id);
    await store.dispatch("updateqty", id);
    await store.dispatch("getproducts");
  } else {
    if (procount.value >= 1) {
      procount.value -= 1;
    }
  }
}

async function addtocard() {
  loading.value = true;
  const res = await store.dispatch("addtoshopcart", {
    product: product.value,
    count: procount.value,
    loading,
  });
  loading.value = res;
}

const qty = computed(() => {
  if (product.value.proqty == 1) {
    return "تنها یک عدد در انبار باقی مانده است";
  } else if (product.value.proqty > 1) {
    return "موجود در انبار";
  } else {
    return "ناموجود";
  }
});

var containshop = computed(() => {
  if (shopcart.value) {
    if (shopcart.value.id == proid.value) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
});
</script>

<style></style>
