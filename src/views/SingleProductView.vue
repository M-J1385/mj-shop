<template>
  <div class="singlepro">
    <div class="container">
      <div class="singleprowrapper">
        <SingleProImage></SingleProImage>
        <SingleProInfo></SingleProInfo>
      </div>
      <div class="similarproducts">
        <h1 class="similartext">محصولات مرتبط</h1>
        <div class="offer_cards">
          <Swiper
            :modules="modules"
            :speed="300"
            navigation
            :breakpoints="{
              0: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              400: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              420: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              440: {
                slidesPerView: 2,
              },
              470: {
                slidesPerView: 2,
              },
              500: {
                slidesPerView: 3,
                spaceBetween: 5,
              },
              515: {
                slidesPerView: 3,
              },
              545: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              801: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              993: {
                slidesPerView: 4,
                spaceBetween: 10,
              },
              1201: {
                slidesPerView: 5,
              },
              1250: {
                slidesPerView: 6,
              },
            }"
          >
            <SwiperSlide v-for="(item, index) in similarpro" :key="index">
              <OfferCard :product="item" :id="item.id" :title="item.title">
                <template #image>
                  <img :src="'/uploads/' + item.image" />
                </template>
                <template #price>
                  <p :class="{ oldprice: item.oldprice }">
                    {{ seprate(item.price) }}
                    <span v-if="!item.oldprice">تومان</span>
                  </p>
                  <p v-if="item.oldprice">{{ seprate(item.oldprice) }} تومان</p>
                </template>
              </OfferCard>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SingleProImage from "@/components/SingleProImage.vue";
import SingleProInfo from "@/components/SingleProInfo.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRoute } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";
import { store } from "@/data/VueX";
import OfferCard from "@/components/OfferCard.vue";
import { seprate } from "@/script";
const modules = [Navigation, Pagination, Autoplay];

const route = useRoute();

const proid = computed(() => route.params.id);

const products = ref([]);

let selectedpro = ref([]);

let selectedcat = ref(null);

async function getproducts() {
  await store.dispatch("getproducts");
  products.value = store.getters.getproducts;
  selectedpro.value = products.value.find((p) => p.id == proid.value);
  selectedcat.value = selectedpro.value.category;
}

const similarpro = ref(null);

async function similar() {
  const res = await store.dispatch("getsimilarpro", {
    cat: selectedcat.value,
    id: proid.value,
  });
  similarpro.value = res;
}

onMounted(async () => {
  await getproducts();
  await similar();
});

watch(
  () => proid.value,
  async () => {
    await getproducts();
    await similar();
  }
);
</script>

<style></style>
