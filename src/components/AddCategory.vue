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
      <button type="submit" id="submitaddcategory">افزودن دسته بندی</button>
    </div>
  </Form>
</template>

<script setup>
import { store } from "@/data/VueX";
import { Form, Field, ErrorMessage, configure } from "vee-validate";
import { ref } from "vue";
import * as yup from "yup";

var initialvalues = ref({});

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
  await store.dispatch("addtocat", values);
  await store.dispatch("setcategory");
  initialvalues.value = {
    persiancat: "",
    englishcat: "",
  };
  formkey.value++;
}
</script>

<style></style>
