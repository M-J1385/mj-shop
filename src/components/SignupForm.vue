<template>
  <Form
    :validation-schema="schema"
    @submit="submitsignup"
    method="post"
    id="signupfrm"
  >
    <div class="input-group">
      <h1>ثبت نام<NotebookPen :size="37"></NotebookPen></h1>
    </div>
    <div class="input-group">
      <div class="input-right">
        <label for="s-username"
          ><CircleUser :size="23"></CircleUser>نام کاربری :
        </label>
        <div class="input-wrapper">
          <Field
            ref="userfield"
            type="text"
            name="s_username"
            id="s-username"
          />
        </div>
        <ErrorMessage name="s_username" class="error"></ErrorMessage>
      </div>
      <div class="input-left">
        <label for="s-password"><Lock :size="23"></Lock>گذرواژه : </label>
        <div class="input-wrapper">
          <Field
            ref="signuppass"
            type="password"
            name="s_password"
            id="s-password"
          />
          <Eye
            v-if="isshow == false"
            @click="showhide"
            :stroke-width="1.5"
            :size="27"
          ></Eye>
          <EyeOff
            :size="27"
            @click="showhide"
            :stroke-width="1.5"
            v-else
          ></EyeOff>
        </div>
        <ErrorMessage name="s_password" class="error"></ErrorMessage>
      </div>
    </div>
    <div class="input-group">
      <div class="input-right">
        <label for="s-repass"
          ><RotateCcw :size="23"></RotateCcw>تکرار گذرواژه :
        </label>
        <div class="input-wrapper">
          <Field ref="repass" type="password" name="s_repass" id="s-repass" />
          <Eye
            v-if="isrepassshow == false"
            @click="showhiderepass"
            :stroke-width="1.5"
            :size="27"
          ></Eye>
          <EyeOff
            :size="27"
            @click="showhiderepass"
            :stroke-width="1.5"
            v-else
          ></EyeOff>
        </div>
        <ErrorMessage name="s_repass" class="error"></ErrorMessage>
      </div>
      <div class="input-left">
        <label for="s-email"><Mail :size="23"></Mail>ایمیل : </label>
        <div class="input-wrapper">
          <Field type="email" name="s_email" id="s-email" />
        </div>
        <ErrorMessage name="s_email" class="error"></ErrorMessage>
      </div>
    </div>
    <div class="input-group">
      <button id="signupbtn" type="submit">ثبت نام</button>
    </div>
    <div class="input-group">
      <p>
        آیا حساب کاربری دارید؟
        <router-link id="login" :to="{ name: 'login' }">وارد شوید</router-link>
      </p>
    </div>
  </Form>
</template>

<script setup>
import {
  Eye,
  EyeOff,
  CircleUser,
  Lock,
  Mail,
  NotebookPen,
  RotateCcw,
} from "lucide-vue-next";
import { ErrorMessage, Field, Form } from "vee-validate";
import { onMounted, ref, watch } from "vue";
import * as yup from "yup";
import { useRouter } from "vue-router";
import { uniqid } from "@/script";
import { store } from "@/data/VueX";
import Swal from "sweetalert2";
import api from "@/axios";
// import { store } from "@/data/VueX";

const router = useRouter();
var userfield = ref("");
var signuppass = ref("");
var repass = ref("");
var isshow = ref(false);
var isrepassshow = ref(false);

function showhide() {
  isshow.value = !isshow.value;
}

function showhiderepass() {
  isrepassshow.value = !isrepassshow.value;
}

watch(
  () => isrepassshow.value,
  (newval) => {
    if (newval == true) {
      repass.value?.$el.setAttribute("type", "text");
    } else {
      repass.value?.$el.setAttribute("type", "password");
    }
  }
);

watch(
  () => isshow.value,
  (newval) => {
    if (newval == true) {
      signuppass.value?.$el.setAttribute("type", "text");
    } else {
      signuppass.value?.$el.setAttribute("type", "password");
    }
  }
);

const schema = yup.object({
  s_username: yup.string().required("این فیلد اجباریست"),
  s_password: yup
    .string()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    })
    .required("این فیلد اجباریست")
    .min(4, "گذرواژه باید بیشتر از 4 کاراکتر باشد"),
  s_email: yup.string().required("این فیلد اجباریست").email("ایمیل معتبر نیست"),
  s_repass: yup
    .string()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    })
    .required("این فیلد اجباریست")
    .min(4, "تکرار گذرواژه باید بیشتر از 4 کاراکتر باشد")
    .oneOf([yup.ref("s_password"), null], "رمز عبور و تکرار آن یکسان نیستند"),
});

onMounted(() => {
  userfield.value?.$el.focus();
});

async function submitsignup(values) {
  const accessid = uniqid();
  try {
    const res = await api.post("/save", {
      accessid,
      username: values.s_username,
      password: values.s_password,
      email: values.s_email,
    });
    if (res.data.status == "success") {
      const logres = await store.dispatch("login", {
        username: values.s_username,
        password: values.s_password,
      });
      if (logres.status == "success") {
        router.push({ name: "address", query: { q: accessid } });
      } else {
        Swal.fire({
          title: "ورود ناموفق بود",
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
  } catch (err) {
    console.log(err);
  }
}
</script>

<style></style>
