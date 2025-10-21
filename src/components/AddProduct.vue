<template>
  <h3>اطلاعات محصول</h3>
  <Form
    :key="formkey"
    enctype="multipart/form-data"
    @submit="submitaddpro"
    :validation-schema="schema"
    :initial-values="initialvalues"
    method="post"
    id="addprofrm"
  >
    <div class="input-group">
      <Field type="text" name="proname" id="proname" placeholder="" />
      <label for="proname">نام محصول </label>
      <ErrorMessage class="error" name="proname"></ErrorMessage>
    </div>
    <div class="input-group">
      <Field type="text" name="proprice" id="proprice" placeholder="" />
      <label for="proprice">قیمت محصول </label>
      <ErrorMessage class="error" name="proprice"></ErrorMessage>
    </div>
    <div class="input-group">
      <Field type="text" name="prooldprice" id="prooldprice" placeholder="" />
      <label for="prooldprice">قیمت پس از تخفیف </label>
      <ErrorMessage class="error" name="prooldprice"></ErrorMessage>
    </div>
    <div class="input-group">
      <Field type="text" name="proqty" id="proqty" placeholder="" />
      <label for="proqty">موجودی</label>
      <ErrorMessage class="error" name="proqty"></ErrorMessage>
    </div>
    <div class="input-group">
      <Listbox v-model="selectval">
        <ListboxButton class="selectbtn">
          <span
            :class="{ darkcolor: selectval !== '' }"
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
      <label :class="{ active: selectval != '' }" for="procat">دسته بندی</label>
      <Field type="text" hidden v-model="selectval" name="procat" id="procat" />
      <ErrorMessage class="error" name="procat"></ErrorMessage>
    </div>
    <div class="input-group">
      <div class="fields">
        <Field
          @change="setfilename"
          type="file"
          name="proimage"
          id="proimage"
          hidden
        />
        <label for="proimage">عکس محصول</label>
        <span v-text="filename" id="filename"></span>
      </div>
      <div class="errorbox">
        <ErrorMessage name="proimage" class="error"></ErrorMessage>
      </div>
    </div>
    <div class="skills">
      <h3>ویژگی های محصول</h3>
      <div class="input-container" v-for="(item, index) in skills" :key="index">
        <div class="input-group">
          <Field
            type="text"
            v-model="item.skillname"
            :name="`skills[${index}].skillname`"
            :id="`skillname${index}`"
            placeholder=""
          ></Field>
          <label :for="`skillname${index}`">نام ویژگی</label>
          <ErrorMessage
            class="error"
            :name="`skills[${index}].skillname`"
          ></ErrorMessage>
        </div>
        <div class="input-group">
          <Field
            type="text"
            v-model="item.skillvalue"
            :name="`skills[${index}].skillvalue`"
            :id="`skillvalue${index}`"
            placeholder=""
          ></Field>
          <label :for="`skillvalue${index}`">مقدار ویژگی</label>
          <ErrorMessage
            class="error"
            :name="`skills[${index}].skillvalue`"
          ></ErrorMessage>
        </div>
      </div>
      <div class="buttoncontainer">
        <button type="button" @click="addskill" id="addskill">
          افزودن ویژگی
        </button>
      </div>
    </div>
    <div class="input-group">
      <button disabled v-if="loading == true" type="submit" id="submitprobtn">
        <LoaderEl></LoaderEl>
      </button>
      <button v-else v-text="btntext" type="submit" id="submitprobtn"></button>
    </div>
  </Form>
</template>

<script setup>
import { store } from "@/data/VueX";
import { uniqid } from "@/script";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { Form, Field, ErrorMessage, configure } from "vee-validate";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as yup from "yup";
import Swal from "sweetalert2";
import LoaderEl from "./LoaderEl.vue";

const route = useRoute();
const router = useRouter();

const filename = ref("عکس محصول را انتخاب کنید");

var loading = ref(false);

var selectval = ref("");

var iseditmode = computed(() => !!route.params.id);
var proinfo = ref(null);

const categories = computed(() => store.getters.getcategory);

const initialvalues = ref({
  proname: "",
  proprice: "",
  prooldprice: "",
  proqty: "",
  procat: "",
  proimage: null,
  skills: [{ skillname: "", skillvalue: "" }],
});

var formkey = ref(0);

async function setcategory() {
  await store.dispatch("setcategory");
}

var btntext = computed(() => {
  if (iseditmode.value) {
    return "ویرایش محصول";
  } else {
    return "افزودن محصول";
  }
});

var oldimage = ref(null);

var skills = ref([{ skillname: "", skillvalue: "" }]);

watch(
  () => route.params.id,
  (newval) => {
    if (!newval) {
      resetformdata();
    } else {
      loadformdata(newval);
    }
  },
  { immediate: true }
);

function resetformdata() {
  initialvalues.value = {
    proname: "",
    proprice: "",
    prooldprice: "",
    proqty: "",
    procat: "",
    proimage: null,
    skills: [{ skillname: "", skillvalue: "" }],
  };
  selectval.value = "";
  filename.value = "عکس محصول را انتخاب کنید";
  skills.value = [{ skillname: "", skillvalue: "" }];
  formkey.value++;
}

async function loadformdata(id) {
  const product = store.getters.getproducts.find((p) => p.id == id);

  if (product) {
    oldimage.value = product.image;
    proinfo.value = product;
    selectval.value = categories.value.find(
      (p) => p.englishcat == product.category
    );
    selectval.value = selectval.value.persiancat;
    filename.value = product.image;
    const currentskills = await store.dispatch("getskills", id);
    var proskills = currentskills.filter((p) => p.proid == id);
    skills.value = proskills.map((item) => ({
      skillname: item.skillname,
      skillvalue: item.skillvalue,
    }));
    initialvalues.value = {
      proname: product.title,
      proprice: product.price,
      prooldprice: product.oldprice,
      proimage: product.image,
      proqty: product.proqty,
    };
    formkey.value++;
  }
}

onMounted(async () => {
  await setcategory();
  await store.dispatch("getproducts");
});

const isempty = computed(() => {
  if (selectval.value == "") {
    return "انتخاب دسته بندی";
  } else {
    return selectval.value;
  }
});

function addskill() {
  skills.value.push({ skillname: "", skillvalue: "" });
}

const schema = yup.object({
  proname: yup.string().required("این فیلد اجباریست"),
  proimage: yup
    .mixed()
    .test("required", "این فیلد اجباریست", function (file) {
      if (!iseditmode.value && !file) {
        return false;
      }
      return true;
    })
    .test("fileSize", "حجم فایل نباید بیشتر از 10 مگ باشد", function (file) {
      if (!file || typeof file === "string") return true;
      return file.size <= 10 * 1024 * 1024;
    })
    .test("fileType", "فایل معتبر نیست", function (file) {
      if (!file || typeof file === "string") return true;
      return ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(
        file.type
      );
    })
    .nonNullable("این فیلد اجباریست"),
  proprice: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    })
    .typeError("فیلد باید عدد باشد")
    .required("این فیلد اجباریست")
    .test("mindigits", "این فیلد باید بیشتر از 3 رقم باشد", (value) => {
      if (value == null || value == undefined) {
        return true;
      } else {
        return value.toString().length > 3;
      }
    }),
  prooldprice: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    })
    .nullable()
    .notRequired()
    .typeError("فیلد باید عدد باشد")
    .test("mindigits", "این فیلد باید بیشتر از 3 رقم باشد", (value) => {
      if (value == null || value == undefined) {
        return true;
      } else {
        return value.toString().length > 3;
      }
    }),

  procat: yup.string().required("این فیلد اجباریست"),
  proqty: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    })
    .typeError("فیلد باید عدد باشد")
    .required("این فیلد اجباریست"),
  skills: yup.array().of(
    yup.object({
      skillname: yup.string().required("این فیلد اجباریست"),
      skillvalue: yup.string().required("این فیلد اجباریست"),
    })
  ),
});
configure({
  validateOnBlur: true,
  validateOnInput: true,
});

async function submitaddpro(values) {
  if (iseditmode.value) {
    loading.value = true;
    var selectcat = categories.value.find(
      (p) => p.persiancat == selectval.value
    );
    values.procat = selectcat.englishcat;
    values.id = route.params.id;
    const res = await store.dispatch("updateproduct", values);
    if (res.status == "success") {
      loading.value = false;
      await store.dispatch("getproducts");
      await store.dispatch("getshopcart");
      Swal.fire({
        title: "محصول با موفقیت ویرایش شد",
        icon: "success",
        customClass: {
          popup: "swal-popup",
          icon: "swal-icon",
        },
        timer: 2000,
        timerProgressBar: true,
        toast: true,
        width: "auto",
        confirmButtonText: "باشه",
      }).then(() => {
        router.push({ name: "editproduct" });
      });
    }
  } else {
    loading.value = true;
    var selectcat1 = categories.value.find(
      (p) => p.persiancat == selectval.value
    );
    values.procat = selectcat1.englishcat;
    const id = uniqid();
    values.id = id;

    const res = await store.dispatch("addproduct", values);
    if (res.status == "success") {
      await store.dispatch("addskills", values);
      loading.value = false;
      resetformdata();
    }
  }
}

function setfilename(e) {
  filename.value = e.target.files[0].name;
}
</script>

<style></style>
