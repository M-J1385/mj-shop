<template>
  <div class="search_input">
    <Form @submit="submitsearch" :key="formkey" :validation-schema="schema">
      <Field
        autocomplete="off"
        v-model="headersearch"
        @keyup="livesearch"
        name="search"
        id="search"
        placeholder="جستجو..."
      ></Field>
      <button type="submit" id="searchsubmit">
        <i class="fa fa-search"></i>
      </button>
    </Form>
    <ul :class="['search_result', { nullsearch: headersearch.length == 0 }]">
      <li class="searchnotfound" v-if="showresult.length == 0">موردی یافت نشد</li>
      <li
        @click="openproduct"
        v-else
        v-for="(item, index) in showresult"
        :key="index"
      >
        <router-link
          :to="{
            name: 'product',
            params: { id: item.id, title: item.title },
          }"
        >
          <div class="searchimage">
            <img :src="'/uploads/' + item.image" :alt="item.image" />
          </div>
          <div class="searchtitle">
            <p>{{ item.title }}</p>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { Field, Form } from "vee-validate";
import { store } from "@/data/VueX";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as yup from "yup";

var headersearch = ref("");
const router = useRouter();
const route = useRoute();
var formkey = ref(0);
var showresult = ref([]);

const schema = yup.object({
  search: yup.string().required(),
});

watch(
  () => route.name,
  (newval) => {
    if (newval != "search") {
      formkey.value++;
    }
  }
);

function submitsearch(values) {
  router.push(`/search?q=${values.search}`);
  headersearch.value = "";
}

function livesearch() {
  if (headersearch.value.length >= 1) {
    var products = store.getters.getproducts;
    var filtersearch = products.filter((p) =>
      p.title.includes(headersearch.value)
    );
    showresult.value = filtersearch;
  }
}

function openproduct() {
  headersearch.value = "";
}
</script>

<style></style>
