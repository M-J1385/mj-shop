<template>
  <div class="shopcart" @click="openpanel">
    <span class="shopcount">{{ totalcount }}</span>
    <!-- <i @click="openpanel" class="fa fa-bag-shopping"></i> -->
    <HandbagIcon :stroke-width="1.7" :size="27"></HandbagIcon>
  </div>
  <div ref="shopcartpanel" class="shopcart_panel">
    <span><i @click="closepanel" class="fa fa-close"></i></span>
    <div class="totalbuy">
      <p class="totaltext">مجموع خرید</p>
      <p class="totalprice">{{ seprate(totalprice) }} تومان</p>
    </div>
    <div
      :class="{ 'shopitems empty': totalcount == 0, shopitems: totalcount > 0 }"
    >
      <div class="emptyshopcart" v-if="totalcount == 0">
        <img src="/images/empty-cart.svg" alt="empty-cart" />
        <h3>سبد خرید شما خالیست</h3>
      </div>
      <div
        @click="openclosepanel"
        v-else
        class="shopitem"
        v-for="item in shopcart"
        :key="item.id"
      >
        <router-link
          class="shoplink"
          :to="{ name: 'product', params: { id: item.id, title: item.title } }"
        >
          <div class="shopimage">
            <img :src="'/uploads/' + item.image" />
          </div>
          <div class="shopinfo">
            <div class="shopinfotop">
              <p class="shoptitle">{{ item.title }}</p>
              <span class="shopremoveitem"
                ><i
                  @click.stop.prevent="removeitem(item.id)"
                  class="fa fa-close"
                ></i
              ></span>
            </div>
            <div class="shopinfobottom">
              <div class="allprice">
                <p
                  :class="{
                    shopoldprice: item.oldprice,
                    oldprice: item.oldprice,
                    shopprice: !item.oldprice,
                  }"
                >
                  {{ seprate(item.price) }}
                  <span v-if="!item.oldprice">تومان</span>
                </p>
                <p class="shopprice" v-if="item.oldprice">
                  {{ seprate(item.oldprice) }} تومان
                </p>
              </div>
              <div @click.stop.prevent class="input-number">
                <i @click="plusnumber(item.id)" class="fa fa-plus"></i>
                <input
                  :value="item.count"
                  type="number"
                  min="1"
                  :max="item.proqty"
                  readonly
                  name="procount"
                  id="procount"
                />
                <i @click="minusshopcart(item.id)" class="fa fa-minus"></i>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div class="shopallsum">
      <div class="shopcountsum">
        <p class="counttext">مجموع اقلام</p>
        <p class="countsum">{{ totalcount }} مورد</p>
      </div>
      <div class="shopdiscountsum">
        <p class="counttext">مجموع تخفیف ها</p>
        <p class="countsum">{{ seprate(totaldis) }} تومان</p>
      </div>
    </div>
    <button class="endingbtn">
      ثبت سفارش ({{ seprate(totalprice) }} تومان)
    </button>
  </div>
  <div @click="closepanel" ref="overlay" class="myoverlay"></div>
</template>

<script setup>
import { store } from "@/data/VueX";
import { emitter } from "@/emitter/EventBus";
import { seprate } from "@/script";
import { HandbagIcon } from "lucide-vue-next";
import { computed, onMounted, ref, watch } from "vue";
const shopcartpanel = ref(null);
var isopen = ref(false);
var overlay = ref(null);

const totaldis = computed(() => store.getters.getdiscountsum);

const totalprice = computed(() => store.getters.getbuysum);

const totalcount = computed(() => store.getters.gettotalcount);

const shopcart = computed(() => store.getters.getshopcart);

const user = computed(() => store.getters.getuser);

async function getshopcart() {
  if (user.value) {
    await store.dispatch("getshopcart");
  }
}

onMounted(() => {
  getshopcart();
});

emitter.on("openpanel", () => {
  openpanel();
});

function removeitem(id) {
  store.dispatch("removeshopitem", id);
}

watch(
  () => isopen.value,
  (newval) => {
    if (newval) {
      shopcartpanel.value.classList.add("active");
      overlay.value.classList.add("active");
    } else {
      shopcartpanel.value.classList.remove("active");
      overlay.value.classList.remove("active");
    }
  }
);

function openpanel() {
  isopen.value = true;
}

function closepanel() {
  isopen.value = false;
}

async function plusnumber(id) {
  await store.dispatch("plusshopcount", id);
  await store.dispatch("updateqty", id);
  await store.dispatch("getproducts");
}
async function minusshopcart(id) {
  await store.dispatch("minusshopcart", id);
  await store.dispatch("updateqty", id);
  await store.dispatch("getproducts");
}
</script>

<style></style>
