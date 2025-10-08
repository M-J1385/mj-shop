<template>
  <section class="slider">
    <div class="container">
      <Swiper
        :modules="modules"
        loop
        :speed="1500"
        :navigation="{ clickable: true }"
        pagination
        :autoplay="{ delay: 3000 }"
      >
        <SwiperSlide>
          <a href="#"><img src="../../public/images/slide1.jpg" alt="slide1" /></a>
        </SwiperSlide>
        <SwiperSlide>
          <a href="#"><img src="../../public/images/slide2.jpg" alt="slide2" /></a>
        </SwiperSlide>
        <SwiperSlide>
          <a href="#"><img src="../../public/images/slide3.jpg" alt="slide3" /></a>
        </SwiperSlide>
        <SwiperSlide>
          <a href="#"><img src="../../public/images/slide4.jpg" alt="slide4" /></a>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
const modules = [Navigation, Pagination, Autoplay];
</script>

<style></style>
