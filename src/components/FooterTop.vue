<template>
  <div class="footer_top">
    <div class="footer_logo">
      <router-link :to="{ name: 'home' }"
        ><img src="/images/logo.png" alt="logo"
      /></router-link>
    </div>
    <div class="footer_backtotop">
      <button @click="backtotop" type="button" class="backtotop_btn">
        بازگشت به بالا
      </button>
    </div>
  </div>
</template>

<script setup>
import { backtotop } from '@/script';
</script>

<style></style>
