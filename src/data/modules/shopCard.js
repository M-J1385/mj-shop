import api from "@/axios";
import Swal from "sweetalert2";
export default {
  state: {
    shopitem: [],
  },
  mutations: {
    setshopcart(state, info) {
      state.shopitem = info;
    },
    clearshopcart(state) {
      state.shopitem = [];
    },
  },
  getters: {
    getbuysum(state) {
      var totalprice = 0;
      state.shopitem.forEach((item) => {
        if (item.oldprice == "" || item.oldprice == null) {
          totalprice += Number(item.price) * Number(item.count);
        }
        totalprice += Number(item.oldprice) * Number(item.count);
      });
      return totalprice;
    },
    getshopcart(state) {
      return state.shopitem;
    },
    gettotalcount(state) {
      return state.shopitem.length;
    },
    getdiscountsum(state) {
      var totalprice = 0;
      state.shopitem.forEach((item) => {
        if (item.oldprice) {
          totalprice += Number(item.price) - Number(item.oldprice);
        }
      });
      return totalprice;
    },
  },
  actions: {
    minusshopcart({ state, dispatch }, id) {
      var current = state.shopitem.find((p) => p.id == id);
      if (current.count > 1) {
        current.count -= 1;
        dispatch("updateshopcount", id);
      }
    },
    plusshopcount({ state, dispatch }, id) {
      var current = state.shopitem.find((p) => p.id == id);
      if (current.count < current.proqty) {
        current.count += 1;
        dispatch("updateshopcount", id);
      }
    },
    async updateshopcount({ state }, id) {
      const current = state.shopitem.find((p) => p.id == id);
      await api.post("/updateshopcount", {
        id: id,
        count: current.count,
      });
    },
    async updateqty({ state }, id) {
      const current = state.shopitem.find((p) => p.id == id);
      const res = await api.post("/updateqty", {
        id: id,
        count: current.count,
      });
      console.log(res.data);
    },
    async addtoshopcart({ state, getters, dispatch }, info) {
      if (getters.getuser) {
        const isdeffer = state.shopitem.find((p) => p.id == info.product.id);
        if (isdeffer) {
          if (info.count >= isdeffer.count || info.count <= isdeffer.count) {
            isdeffer.count = info.count;
            dispatch("updateshopcount", isdeffer.id);
            Swal.fire({
              title: "محصول در سبد خرید شما وجود دارد",
              icon: "success",
              customClass: {
                container:"swalcontainer",
                popup: "swal-popup",
                icon: "swal-icon",
              },
              timer: 2000,
              timerProgressBar: true,
              toast: true,
              width: "auto",
              confirmButtonText: "باشه",
            });
          }
        } else {
          try {
            const res = await api.post("/addtoshopcart", {
              id: info.product.id,
              title: info.product.title,
              image: info.product.image,
              price: info.product.price,
              oldprice: info.product.oldprice,
              category: info.product.category,
              proqty: info.product.proqty,
              count: info.count,
              username: getters.getuser.username,
            });
            dispatch("getshopcart");
            if (res.data.status == "success") {
              info.loading = false;
              Swal.fire({
                title: "محصول به سبد خرید اضافه شد",
                icon: "success",
                customClass: {
                  container:"swalcontainer",
                  popup: "swal-popup",
                  icon: "swal-icon",
                },
                timer: 2000,
                timerProgressBar: true,
                toast: true,
                width: "auto",
                confirmButtonText: "باشه",
              });
              return info.loading;
            }
          } catch (err) {
            console.log(err);
          }
        }
      } else {
        info.loading = false;
        Swal.fire({
          title: "ابتدا باید وارد شوید",
          icon: "error",
          customClass: {
            container: "swalcontainer",
            popup: "swal-popup",
            icon: "swal-icon",
          },
          // timer: 3000,
          // timerProgressBar: true,
          toast: true,
          width: "auto",
          confirmButtonText: "باشه",
        });
        return info.loading;
      }
    },

    async removeshopitem({ state, commit }, id) {
      try {
        const res = await api.post("/deleteshopitem", {
          id: id,
        });
        if (res.data.status == "success") {
          const newshopitem = state.shopitem.filter((p) => p.id != id);
          commit("setshopcart", newshopitem);
          Swal.fire({
            title: "محصول از سبد خرید حذف شد",
            icon: "success",
            position: "top",
            customClass: {
              popup: "swal-popup-shop",
              container: "swal-container-shop swalcontainerlogin",
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
    },

    async getshopcart({ dispatch, commit, getters }) {
      try {
        await dispatch("checkLogin");
        const username = getters.getuser?.username;
        const res = await api.get(`/getshopcart?username=${username}`);
        commit("setshopcart", res.data);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
