<template>
  <Form
    @submit="submitlogin"
    :validation-schema="schema"
    method="post"
    id="loginfrm"
  >
    <div class="input-group">
      <h1>ورود<LogIn :size="37"></LogIn></h1>
    </div>
    <div class="input-group">
      <label for="username"
        ><CircleUser :size="23"></CircleUser>نام کاربری :
      </label>
      <div class="input-wrapper">
        <Field type="text" ref="userfield" name="username" id="username" />
      </div>
      <ErrorMessage name="username" class="error"></ErrorMessage>
    </div>
    <div class="input-group">
      <label for="password"><Lock :size="23"></Lock>گذرواژه : </label>
      <div class="input-wrapper">
        <Field ref="loginpass" type="password" name="password" id="password" />
        <eye
          v-if="isshow == false"
          :stroke-width="1.5"
          @click="showhide"
          :size="37"
        ></eye>
        <eye-off
          v-else
          :size="37"
          :stroke-width="1.5"
          @click="showhide"
        ></eye-off>
      </div>
      <ErrorMessage name="password" class="error"></ErrorMessage>
    </div>
    <div class="input-group">
      <button v-if="loading == true" type="submit">
        <LoaderEl></LoaderEl>
      </button>
      <button v-else type="submit">ورود</button>
    </div>
    <div class="input-group">
      <p>
        حساب کاربری ندارید؟
        <router-link id="signup" :to="{ name: 'signup' }">ثبت نام</router-link>
        کنید
      </p>
    </div>
  </Form>
</template>

<script setup>
import { store } from "@/data/VueX";
import { Eye, EyeOff, LogIn, CircleUser, Lock } from "lucide-vue-next";
import { configure, ErrorMessage, Field, Form } from "vee-validate";
import { onMounted, ref, watch } from "vue";
import * as yup from "yup";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import LoaderEl from "./LoaderEl.vue";

var loading = ref(false);
const router = useRouter();
var isshow = ref(false);
const loginpass = ref("");
// const users = computed(() => store.getters.getusers);
var showfrm = ref(false);
// var islogin = computed(() => store.getters.islogin);
var userfield = ref("");
// const user = { userlogin: false, username: "", useradmin: false };

async function fetchuser() {
  await store.dispatch("fetchuser");
}

watch(
  () => isshow.value,
  (newval) => {
    if (newval == true) {
      loginpass.value?.$el.setAttribute("type", "text");
    } else {
      loginpass.value?.$el.setAttribute("type", "password");
    }
  }
);

function showhide() {
  isshow.value = !isshow.value;
}

onMounted(() => {
  fetchuser();
  showfrm.value = false;
  userfield.value?.$el.focus();
});

const schema = yup.object({
  username: yup.string().required("این فیلد اجباریست"),
  password: yup
    .string()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    })
    .required("این فیلد اجباریست")
    .min(4, "گذرواژه باید بیشتر از 4 کاراکتر باشد"),
});

configure({
  validateOnBlur: true,
  validateOnChange: true,
});

async function submitlogin(values) {
  loading.value = true;
  try {
    const res = await store.dispatch("login", {
      username: values.username,
      password: values.password,
    });
    if (res.status == "success") {
      loading.value = false;
      Swal.fire({
        title: "خوش آمدید",
        icon: "success",
        position: "top",
        customClass: {
          container: "swalcontainerlogin",
          popup: "swal-popup-login",
        },
        timer: 3000,
        timerProgressBar: true,
        toast: true,
        width: "auto",
        showConfirmButton: false,
      }).then(() => {
        router.push({ name: "home" });
      });
    } else {
      loading.value = false;
      Swal.fire({
        title: res.message,
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
  } catch (err) {
    console.log(err);
  }
  // const isfind = users.value.find(
  //   (p) => p.username == values.username && p.password == values.password
  // );

  // if (isfind) {
  //   user.userlogin = true;
  //   if (isfind.useradmin == 1) {
  //     user.useradmin = true;
  //   }
  //   store.commit("setuser", user);
  //   Swal.fire({
  //     title: "خوش آمدید",
  //     icon: "success",
  //     position: "top",
  //     customClass: {
  //       popup: "swal-popup-login",
  //     },
  //     timer: 3000,
  //     timerProgressBar: true,
  //     toast: true,
  //     width: "auto",
  //     showConfirmButton: false,
  //   }).then(() => {
  //     router.push({ name: "home" });
  //   });
  // } else {
  //   Swal.fire({
  //     title: "کاربر پیدا نشد",
  //     icon: "error",
  //     position: "top",
  //     customClass: {
  //       popup: "swal-popup-login",
  //     },
  //     timer: 3000,
  //     timerProgressBar: true,
  //     toast: true,
  //     width: "auto",
  //     showConfirmButton: false,
  //   });
  // }
  // fetchuser();
}
</script>

<style></style>
