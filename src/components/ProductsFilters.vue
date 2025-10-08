<template>
  <div class="product_filters">
    <i class="fa fa-list"></i>
    <div class="filterwrapper">
      <Listbox v-model="filterval">
        <ListboxButton class="selectbtn">
          <span
            :class="{ darkcolor: filterval !== '' }"
            v-text="isempty"
          ></span>
          <span>
            <i class="fa fa-chevron-down"></i>
          </span>
        </ListboxButton>

        <ListboxOptions class="selectul">
          <ListboxOption
            v-slot="{ active, selected }"
            value="جدیدترین"
            as="template"
          >
            <li :class="[active ? 'active' : '', selected ? 'selected' : '']">
              <span>جدیدترین</span>
              <span v-if="selected">
                <i class="fa fa-check"></i>
              </span>
            </li>
          </ListboxOption>
          <ListboxOption
            v-slot="{ active, selected }"
            value="گرانترین"
            as="template"
          >
            <li :class="[active ? 'active' : '', selected ? 'selected' : '']">
              <span>گرانترین</span>
              <span v-if="selected">
                <i class="fa fa-check"></i>
              </span>
            </li>
          </ListboxOption>
          <ListboxOption
            v-slot="{ active, selected }"
            value="ارزانترین"
            as="template"
          >
            <li :class="[active ? 'active' : '', selected ? 'selected' : '']">
              <span>ارزانترین</span>
              <span v-if="selected">
                <i class="fa fa-check"></i>
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </Listbox>
    </div>
    <p class="filtertitle">مرتب سازی بر اساس :</p>
    <ul class="filteroptions">
      <li
        @click="showfilter('newpro')"
        :class="{ active: activefilter == 'newpro' }"
      >
        جدیدترین
      </li>
      <li
        @click="showfilter('exppro')"
        :class="{ active: activefilter == 'exppro' }"
      >
        گرانترین
      </li>
      <li
        @click="showfilter('cheappro')"
        :class="{ active: activefilter == 'cheappro' }"
      >
        ارزانترین
      </li>
    </ul>
  </div>
</template>

<script setup>
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { computed, defineEmits, defineProps, ref, watch } from "vue";
defineProps({
  activefilter: String,
});
var filterval = ref("");
const emits = defineEmits(["changefilter"]);
function showfilter(filter) {
  emits("changefilter", filter);
}

var isempty = computed(() => {
  if (filterval.value == "") {
    return "مرتب سازی بر اساس";
  } else {
    return filterval.value;
  }
});

watch(
  () => filterval.value,
  (newval) => {
    if (newval == "جدیدترین") {
      emits("changefilter", "newpro");
    } else if (newval == "گرانترین") {
      emits("changefilter", "exppro");
    } else if (newval == "ارزانترین") {
      emits("changefilter", "cheappro");
    }
  }
);
</script>
<style></style>
