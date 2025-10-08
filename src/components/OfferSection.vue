<template>
  <section class="offer">
    <div class="container">
      <div class="offer_wrapper">
        <OfferText>
          <slot name="offertext"></slot>
        </OfferText>
        <div class="offer_cards">
          <slot name="offercards"></slot>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>


import OfferText from "./OfferText.vue";

</script>

<style></style>
