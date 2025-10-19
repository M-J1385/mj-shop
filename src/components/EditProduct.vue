<template>
  <div class="editpro">
    <ul>
      <li v-for="(item, index) in products" :key="index">
        <router-link :to="{ name: 'editform', params: { id: item.id } }">
          <div class="editimage">
            <img :src="'/uploads/' + item.image" :alt="item.image" />
          </div>
          <div class="edittitle">
            <h3>{{ item.title }}</h3>
          </div>
          <div class="editprices">
            <p :class="{ oldprice: item.oldprice }">
              {{ seprate(item.price) }}
              <span v-if="!item.oldprice">تومان</span>
            </p>
            <p v-if="item.oldprice">{{ seprate(item.oldprice) }} تومان</p>
          </div>
          <div class="editcatqty">
            <p class="editqty">موجودی : {{ item.proqty }}</p>
            <p class="editcat">دسته بندی : {{ item.category }}</p>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { store } from "@/data/VueX";
import { seprate } from "@/script";
import { computed, onMounted } from "vue";

var products = computed(() =>
  [...store.getters.getproducts].sort((a, b) => b.autoid - a.autoid)
);

onMounted(async () => {
  await store.dispatch("getproducts");
});
</script>
