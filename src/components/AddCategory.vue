<template>
  <Form
    :key="formkey"
    @submit="submitaddcat"
    :validation-schema="schema"
    :initial-values="initialvalues"
    method="post"
    id="addcategoryfrm"
  >
    <div class="input-group">
      <Field type="text" name="persiancat" id="persiancat" placeholder="" />
      <label for="persiancat">نام فارسی دسته بندی</label>
      <ErrorMessage class="error" name="persiancat"></ErrorMessage>
    </div>
    <div class="input-group">
      <Field type="text" name="englishcat" id="englishcat" placeholder="" />
      <label for="englishcat">نام انگلیسی دسته بندی</label>
      <ErrorMessage class="error" name="englishcat"></ErrorMessage>
    </div>
    <div class="input-group">
      <div class="fields">
        <Field
          @change="setfilename"
          type="file"
          name="catimage"
          id="catimage"
          hidden
        />
        <label for="catimage">عکس دسته بندی</label>
        <span v-text="filename" id="filename"></span>
      </div>
      <div class="errorbox">
        <ErrorMessage name="catimage" class="error"></ErrorMessage>
      </div>
    </div>
    <div class="input-group"></div>
    <div class="input-group">
      <button v-if="loading == true" type="submit" id="submitaddcategory">
        <LoaderEl></LoaderEl>
      </button>
      <button v-else type="submit" id="submitaddcategory">
        افزودن دسته بندی
      </button>
    </div>
  </Form>
</template>

<script setup>
import { store } from "@/data/VueX";
import { Form, Field, ErrorMessage, configure } from "vee-validate";
import { ref } from "vue";
import * as yup from "yup";
import LoaderEl from "./LoaderEl.vue";

var loading = ref(false);
var initialvalues = ref({});
const filename = ref("عکس دسته را انتخاب کنید");

var formkey = ref(0);

const schema = yup.object({
  persiancat: yup
    .string()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    })
    .matches(/^[\u0600-\u06FF\s]+$/, "فقط حروف فارسی مجاز است")
    .required("این فیلد اجباریست"),
  englishcat: yup
    .string()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    })
    .matches(/^[A-Za-z\s]+$/, "فقط حروف انگلیسی مجاز است")
    .required("این فیلد اجباریست"),
});
configure({
  validateOnBlur: true,
  validateOnInput: true,
});

async function submitaddcat(values) {
  loading.value = true;
  const res = await store.dispatch("addtocat", values);
  loading.value = res;
  await store.dispatch("setcategory");
  initialvalues.value = {
    persiancat: "",
    englishcat: "",
    catimage: "",
  };
  filename.value = "";
  formkey.value++;
}

function setfilename(e) {
  filename.value = e.target.files[0].name;
}
</script>

<style></style>
