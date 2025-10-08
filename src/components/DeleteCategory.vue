<template>
  <div class="deletecat">
    <Form
      :key="formkey"
      @submit="deletecategory"
      :validation-schema="schema"
      method="post"
      id="deletecatfrm"
    >
      <div class="input-group">
        <Listbox v-model="deletecat">
          <ListboxButton id="selectbtn" class="selectbtn">
            <span
              :class="{ darkcolor: deletecat !== '' }"
              v-text="isempty"
            ></span>
            <span>
              <i class="fa fa-chevron-down"></i>
            </span>
          </ListboxButton>

          <ListboxOptions class="selectul">
            <ListboxOption
              v-slot="{ active, selected }"
              v-for="(item, index) in categories"
              :key="index"
              :value="item.persiancat"
              as="template"
            >
              <li :class="[active ? 'active' : '', selected ? 'selected' : '']">
                <span>{{ item.persiancat }}</span>
                <span v-if="selected">
                  <i class="fa fa-check"></i>
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </Listbox>
        <label for="selectbtn" :class="{ active: deletecat != '' }"
          >دسته بندی</label
        >
        <Field
          type="text"
          hidden
          v-model="deletecat"
          name="procat"
          id="procat"
        />
        <ErrorMessage class="error" name="procat"></ErrorMessage>
      </div>
      <div class="input-group">
        <button type="submit" id="submitdeletecat">حذف دسته بندی</button>
      </div>
    </Form>
  </div>
</template>

<script setup>
import { store } from "@/data/VueX";
import { configure, ErrorMessage, Field, Form } from "vee-validate";
import { computed, onMounted, ref } from "vue";
import * as yup from "yup";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";

var formkey = ref(0);

const categories = computed(() => store.getters.getcategory);

var deletecat = ref("");

const isempty = computed(() => {
  if (deletecat.value == "") {
    return "انتخاب دسته بندی";
  } else {
    return deletecat.value;
  }
});

onMounted(async () => {
  await store.dispatch("setcategory");
});

const schema = yup.object({
  procat: yup.string().required("این فیلد اجباریست"),
});

configure({
  validateOnBlur: true,
  validateOnChange: true,
});

async function deletecategory(values) {
  await store.dispatch("deletecategory", values);
  await store.dispatch("setcategory");
  deletecat.value = "";
  formkey.value++;
}
</script>

<style></style>
