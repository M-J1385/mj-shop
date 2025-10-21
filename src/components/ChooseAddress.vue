<template>
  <div class="mapinfo">
    <Form
      method="post"
      id="addressfrm"
      :validation-schema="schema"
      @submit="addresssubmit"
    >
      <div class="input-group">
        <label for="mapaddress">آدرس انتخاب شده در نقشه</label>
        <Field
          as="textarea"
          name="mapaddress"
          id="mapaddress"
          v-model="address"
          disabled
        ></Field>
        <ErrorMessage name="mapaddress" class="error"></ErrorMessage>
      </div>
      <div class="input-group twice">
        <div class="input-right">
          <label for="mappelak">پلاک</label>
          <div class="input-wrapper">
            <Field name="mappelak" id="mappelak"></Field>
          </div>
          <ErrorMessage name="mappelak" class="error"></ErrorMessage>
        </div>
        <div class="input-left">
          <label for="mapvahed">واحد</label>
          <div class="input-wrapper">
            <Field name="mapvahed" id="mapvahed"></Field>
          </div>
          <ErrorMessage name="mapvahed" class="error"></ErrorMessage>
        </div>
      </div>
      <div class="input-group">
        <button disabled v-if="loading == true" type="submit" id="submitaddress">
          <LoaderEl></LoaderEl>
        </button>
        <button v-else type="submit" id="submitaddress">تایید</button>
      </div>
    </Form>
  </div>
  <div class="map">
    <MapComponent
      :options="{
        mapKey: 'web.765489793f894adc894c79ef6409a085',
        mapType: MapTypes.neshanVector,
        zoom: 15,
        center: [51.389, 35.6892],
      }"
      v-bind:map-setter="mapSetter"
    />
    <div class="marker-center">
      <img src="/images/marker.png" alt="marker" />
    </div>
    <button class="locate-btn" @click="locateMe">
      <LocateFixed :size="30"></LocateFixed>
    </button>
    <div class="search-box">
      <input
        v-model="searchQuery"
        placeholder="جستجوی مکان، خیابان، کسب‌وکار..."
      />
      <ul v-if="searchResults.length" class="suggest-list">
        <li v-for="(p, i) in searchResults" :key="i" @click="selectPlace(p)">
          <div class="suggest-title">{{ p.title }}</div>
          <div class="suggest-sub">{{ p.address }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { MapComponent, MapTypes } from "@neshan-maps-platform/mapbox-gl-vue";
import "@neshan-maps-platform/mapbox-gl-vue/dist/style.css";
import { configure, ErrorMessage, Field, Form } from "vee-validate";
import axios from "axios";
import * as yup from "yup";
import Swal from "sweetalert2";
import { useRoute, useRouter } from "vue-router";
import { LocateFixed } from "lucide-vue-next";
import { store } from "@/data/VueX";
import api from "@/axios";
import LoaderEl from "./LoaderEl.vue";

var loading = ref(false);
const route = useRoute();
const router = useRouter();

const accessid = computed(() => route.query.q);

const searchQuery = ref("");
let debounceTimer = null;
const searchResults = ref([]);
let mapInstance = null;
const address = ref("در حال دریافت آدرس ...");

const mapSetter = (map) => {
  mapInstance = map;

  // اولین بار که نقشه لود شد یکبار آدرس مرکز را بگیر
  map.once("load", () => doReverseFromCenter());

  // هر بار نقشه وایستاد، آدرس مرکز را بگیر
  map.on("moveend", () => doReverseFromCenter());
};

async function doReverseFromCenter() {
  try {
    const c = mapInstance.getCenter();

    const { data } = await axios.get("https://api.neshan.org/v5/reverse", {
      params: { lat: c.lat, lng: c.lng },
      headers: { "Api-Key": "service.31cd6a63da824344a46dcea24a6d5a3c" }, // کلید Services → Reverse
    });
    address.value = data.formatted_address || "آدرس یافت نشد";
  } catch (e) {
    address.value = "❌ خطا در گرفتن آدرس";
    console.error(
      "Reverse error:",
      e?.response?.status,
      e?.response?.data || e
    );
  }
}

function locateMe() {
  if (!navigator.geolocation) {
    alert("❌ مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      mapInstance?.flyTo({
        center: [longitude, latitude],
        zoom: 16,
        essential: true,
      });
    },
    (err) => {
      console.error("Geolocation error:", err);
      alert("❌ موقعیت مکانی قابل دریافت نیست");
    }
  );
}

watch(searchQuery, (val) => {
  clearTimeout(debounceTimer);
  if (!val?.trim()) {
    searchResults.value = [];
    return;
  }
  debounceTimer = setTimeout(() => runSearch(val.trim()), 350);
});

async function runSearch(term) {
  try {
    const center = mapInstance
      ? mapInstance.getCenter()
      : { lat: 35.6892, lng: 51.389 };

    const res = await axios.get("https://api.neshan.org/v1/search", {
      params: { term, lat: center.lat, lng: center.lng },
      headers: { "Api-Key": "service.31cd6a63da824344a46dcea24a6d5a3c" }, // کلید Search API
    });

    const items = Array.isArray(res.data?.items) ? res.data.items : [];
    searchResults.value = items.map((it) => ({
      title: it.title,
      address: it.address,
      lat: it?.location?.y,
      lng: it?.location?.x,
    }));
  } catch (e) {
    console.error("Search error:", e?.response?.status, e?.response?.data || e);
  }
}

function selectPlace(item) {
  if (!item?.lat || !item?.lng) return;
  mapInstance?.flyTo({
    center: [item.lng, item.lat],
    zoom: 16,
    essential: true,
  });
  searchQuery.value = item.title + (item.address ? `، ${item.address}` : "");
  searchResults.value = [];
  searchQuery.value = "";
}

const schema = yup.object({
  mapaddress: yup.string().required("این فیلد اجباریست"),
  mapvahed: yup
    .number()
    .typeError("مقدار فیلد عدد است")
    .required("این فیلد اجباریست"),
  mappelak: yup.string().required("این فیلد اجباریست"),
});
configure({
  validateOnBlur: true,
  validateOnChange: true,
});

async function addresssubmit(values) {
  loading.value = true;
  try {
    const res = await api.post("/addaddress", {
      address: values.mapaddress,
      pelak: values.mappelak,
      vahed: values.mapvahed,
      id: accessid.value,
    });
    if (res.data.status == "success") {
      loading.value = false;
      await store.dispatch("checkLogin");
      Swal.fire({
        title: "ثبت نام انجام شد",
        icon: "success",
        position: "top",
        customClass: {
          popup: "swal-popup-login",
        },
        timer: 3000,
        timerProgressBar: true,
        toast: true,
        width: "auto",
        showConfirmButton: false,
      }).then(() => {
        router.push("/");
      });
    }
  } catch (err) {
    console.log(err);
  }
}
</script>

<style></style>
