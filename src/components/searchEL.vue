<template>
  <div class="header_search">
    <i @click="showmodalsearch" class="fa fa-search"></i>
  </div>
  <div @click="closemodalsearch" class="modal_search" ref="modal_search">
    <div @click.stop ref="modal_wrapper" class="modal_search_wrapper">
      <i @click="closemodalsearch" class="fa fa-close"></i>
      <h2>هر چی میخای جستجو کن</h2>
      <div class="search_group">
        <i @click="gotosearch" class="fa fa-search"></i>
        <form @submit.prevent="gotosearch" id="searchfrm">
          <input
            v-model="search"
            ref="searchel"
            placeholder="جستجو ..."
            type="text"
            name="search"
            id="search"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import Swal from "sweetalert2";
import { ref } from "vue";
import { useRouter } from "vue-router";
var searchel = ref(null);
const modal_search = ref(null);
const modal_wrapper = ref(null);
function showmodalsearch() {
  modal_search.value.classList.add("active");
  modal_wrapper.value.classList.add("active");
  setTimeout(() => {
    searchel.value.focus();
  }, 200);
}
function closemodalsearch() {
  modal_search.value.classList.remove("active");
  modal_wrapper.value.classList.remove("active");
}
const search = ref("");
const router = useRouter();
function gotosearch() {
  if (!search.value || search.value.trim() === null || search.value === "") {
    Swal.fire({
      title: "کادر جستجو خالیست",
      icon: "error",
      customClass: {
        container: "swal-container",
        popup: "swal-popup",
        icon: "swal-icon",
      },
      timer: 3000,
      timerProgressBar: true,
      toast: true,
      position: "center",
      width: "auto",
      confirmButtonText: "باشه",
    });
    return;
  } else {
    closemodalsearch();
    router.push({ name: "search", query: { q: search.value } });
    search.value = "";
  }
}
</script>

<style></style>
