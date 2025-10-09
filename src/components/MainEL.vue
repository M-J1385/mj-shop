<template>
  <SliderSection></SliderSection>
  <OfferSection>
    <template #offertext>
      <img
        src="../../public/images/Amazings.svg"
        alt="amazing"
        class="offer_text_img"
      />
      <img
        src="../../public/images/Amazing1.svg"
        alt="amazing"
        class="offer_text_img"
      />
    </template>
    <template #offercards>
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
            slidesPerView: 3,
            spaceBetween: 10,
          },
          420: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          440: {
            slidesPerView: 2,
          },
          500: {
            slidesPerView: 2,
            spaceBetween: 5,
          },
          530: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          576: {
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
        }"
      >
        <SwiperSlide v-for="(item, index) in discountoffer" :key="index">
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
    </template>
  </OfferSection>
  <BannerSection>
    <TwoPartBanner>
      <template #banner1>
        <a href="#"
          ><img src="../../public/images/banner.png" alt="banner"
        /></a>
      </template>
      <template #banner2>
        <a href="#"
          ><img src="../../public/images/banner1.webp" alt="banner1"
        /></a>
      </template>
    </TwoPartBanner>
    <LinearBanner>
      <a href="#"
        ><img src="../../public/images/banner3.webp" alt="banner"
      /></a>
    </LinearBanner>
  </BannerSection>
  <OfferSection>
    <template #offertext>
      <h1>جدیدترین محصولات</h1>
      <img
        src="../../public/images/new-product.png"
        alt="new-product"
        class="offer_text_img"
      />
    </template>
    <template #offercards>
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
            slidesPerView: 3,
            spaceBetween: 10,
          },
          420: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          440: {
            slidesPerView: 2,
          },
          500: {
            slidesPerView: 2,
            spaceBetween: 5,
          },
          530: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          576: {
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
        }"
      >
        <SwiperSlide v-for="(item, index) in offers" :key="index">
          <OfferCard :product="item" :id="item.id" :title="item.title">
            <template #image>
              <img :src="'../../public/uploads/' + item.image" />
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
        <SwiperSlide>
          <div class="offer_card">
            <router-link class="showmorepro" :to="{ name: 'products' }">
              <CircleArrowLeft :size="60" :stroke-width="1"></CircleArrowLeft>
              <p>نمایش همه</p>
            </router-link>
          </div>
        </SwiperSlide>
      </Swiper>
    </template>
  </OfferSection>
  <CategoryBuy></CategoryBuy>
  <BannerSection>
    <LinearBanner>
      <a href="#"><img src="../../public/images/banner4.jpg" alt="banner" /></a>
    </LinearBanner>
  </BannerSection>
</template>

<script setup>
import BannerSection from "./BannerSection.vue";
import OfferSection from "./OfferSection.vue";
import SliderSection from "./SliderSection.vue";
import OfferCard from "./OfferCard.vue";
import CategoryBuy from "./CategoryBuy.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
const modules = [Navigation, Pagination, Autoplay];
import TwoPartBanner from "./TwoPartBanner.vue";
import LinearBanner from "./LinearBanner.vue";
import { store } from "@/data/VueX";
import { onMounted, ref } from "vue";
import { seprate } from "@/script";
import { CircleArrowLeft } from "lucide-vue-next";
var offers = ref([]);
var discountoffer = ref([]);

async function getproducts() {
  await store.dispatch("getproducts");
  offers.value = store.getters.getproducts
    .sort((a, b) => b.autoid - a.autoid)
    .slice(0, 10);
  discountoffer.value = store.getters.getproducts
    .filter((p) => p.oldprice !== "")
    .slice(0, 10);
}

onMounted(() => {
  getproducts();
});
</script>

<style></style>
