<template>
  <HeaderEL></HeaderEL>
  <div class="container">
    <div class="admincontainer">
      <div class="adminsidepanel">
        <h1>مدیریت</h1>
        <i
          ref="adminiconmenu"
          @click="openadminmenu"
          class="adminmenuicon fa fa-bars"
        ></i>
        <ul ref="ulmenu" :class="['adminmenu', { active: isopen }]">
          <li>
            <router-link :to="{ name: 'addproduct' }">افزودن محصول</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'editproduct' }"
              >ویرایش محصول</router-link
            >
          </li>
          <li>
            <router-link :to="{ name: 'deleteproduct' }">حذف محصول</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'addcategory' }"
              >افزودن دسته بندی</router-link
            >
          </li>
          <li>
            <router-link :to="{ name: 'deletecategory' }"
              >حذف دسته بندی</router-link
            >
          </li>
        </ul>
      </div>
      <div class="adminmaincontent">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeaderEL from "@/components/HeaderEL.vue";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
var isopen = ref(false);
var adminiconmenu = ref(null);
var ulmenu = ref(null);
watch(
  () => route.path,
  (newRoute) => {
    if (newRoute.includes("admin")) {
      document.body.className = "admin";
    } else {
      document.body.className = "index";
    }
  },
  { immediate: true }
);
onMounted(() => {
  ulmenu.value?.querySelectorAll("li").forEach((element) => {
    element.addEventListener("click", function () {
      openadminmenu();
    });
  });
});

function openadminmenu() {
  isopen.value = !isopen.value;
  if (isopen.value) {
    adminiconmenu.value.classList = "adminmenuicon fa fa-times";
  } else {
    adminiconmenu.value.classList = "adminmenuicon fa fa-bars";
  }
}
</script>

<style></style>
