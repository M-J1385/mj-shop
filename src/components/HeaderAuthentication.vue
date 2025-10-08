<template>
  <router-link
    v-if="!user?.username"
    class="header_auth"
    :to="{ name: 'login' }"
  >
    <User :size="25"></User>ورود/ثبت نام
  </router-link>
  <div @click.stop="openusermenu" class="header_auth login_header" v-else>
    <UserRound :stroke-width="1.5" :size="32"></UserRound>
    <ChevronDown :size="25"></ChevronDown>
    <ul :class="['usermenu', { active: isopen }]">
      <li>
        <router-link class="username" to="/">{{ user.username }}</router-link>
      </li>
      <li><router-link @click.prevent="logout" to="/">خروج</router-link></li>
      <li><router-link to="/">حساب کاربری</router-link></li>
    </ul>
  </div>
</template>

<script setup>
import { store } from "@/data/VueX";
import { User, UserRound, ChevronDown } from "lucide-vue-next";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
const router = useRouter();
// const users = ref([]);
var isopen = ref(false);

// const fetchuser = async () => {
//   const data = store.dispatch("fetchuser");
//   users.value = data;
// };

// onMounted(async () => {
//   await fetchuser();
// });

const user = computed(() => store.getters.getuser);

async function logout() {
  const res = await store.dispatch("logout");
  if (res.status == "success") {
    Swal.fire({
      title: "از حساب کاربری خارج شدید",
      icon: "success",
      position: "top",
      customClass: {
        container: "swal-container",
        popup: "swal-popup-login",
      },
      timer: 3000,
      width: "auto",
      timerProgressBar: true,
      toast: true,
      showConfirmButton: false,
    }).then(() => {
      router.push("/");
    });
  } else {
    Swal.fire({
      title: "خروج ناموفق بود",
      icon: "error",
      position: "top",
      customClass: {
        popup: "swal-popup-login",
      },
      timer: 3000,
      timerProgressBar: true,
      toast: true,
      width: "auto",
      showConfirmButton: false,
    });
  }
}

document.body.addEventListener("click", function () {
  isopen.value = false;
});

function openusermenu() {
  isopen.value = !isopen.value;
}
</script>
