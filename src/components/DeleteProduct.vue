<template>
  <div class="editpro">
    <ul>
      <li v-for="(item, index) in products" :key="index">
        <a @click.prevent.stop="deleteproduct(item.id)" class="editcontainer">
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
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { store } from "@/data/VueX";
import { seprate } from "@/script";
import { computed, onMounted } from "vue";
import Swal from "sweetalert2";

const products = computed(() =>
  [...store.getters.getproducts].sort((a, b) => b.autoid - a.autoid)
);

onMounted(async () => {
  await store.dispatch("getproducts");
});

async function deleteproduct(id) {
  const res = await store.dispatch("deleteproduct", id);
  if (res.status == "success") {
    await store.dispatch("getproducts");
    Swal.fire({
      title: "محصول حذف شد",
      icon: "success",
      customClass: {
        popup: "swal-popup",
        icon: "swal-icon",
      },
      timer: 1500,
      timerProgressBar: true,
      toast: true,
      width: "auto",
      confirmButtonText: "باشه",
    });
  }
}
</script>
