import api from "@/axios";
import Swal from "sweetalert2";

export default {
  state: {
    products: [],
  },
  getters: {
    getproducts(state) {
      return state.products;
    },
  },
  mutations: {
    setproducts(state, info) {
      state.products = info;
    },
  },
  actions: {
    async getsimilarpro(state, info) {
      const res = await api.get(
        `/getsimilarpro?cat=${info.cat}&id=${info.id}`
      );
      return res.data;
    },
    async getproducts({ commit }) {
      try {
        const res = await api.get("/getproducts");
        commit("setproducts", res.data);
      } catch (err) {
        console.log("خطا", err);
      }
    },
    async addproduct(state, values) {
      try {
        const formdata = new FormData();
        formdata.append("id", values.id);
        formdata.append("title", values.proname);
        formdata.append("image", values.proimage);
        formdata.append("price", values.proprice);
        formdata.append("oldprice", values.prooldprice || "");
        formdata.append("category", values.procat);
        formdata.append("proqty", values.proqty);
        formdata.append("skills", JSON.stringify(values.skills));
        const res = await api.post(
          "/addproduct",
          formdata
        );
        if (res.data.status == "success") {
          Swal.fire({
            title: "محصول اضافه شد",
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
          });
          return res.data;
        }
      } catch (err) {
        console.log(err);
      }
    },

    async updateproduct(state, values) {
      try {
        const formdata = new FormData();
        formdata.append("id", values.id);
        formdata.append("title", values.proname);
        formdata.append("image", values.proimage);
        formdata.append("price", values.proprice);
        formdata.append("oldprice", values.prooldprice || "");
        formdata.append("category", values.procat);
        formdata.append("proqty", values.proqty);
        formdata.append("skills", JSON.stringify(values.skills));
        const res = await api.post(
          `/updateproduct`,
          formdata
        );
        return res.data;
      } catch (err) {
        console.log(err);
      }
    },
    async deleteproduct(state, id) {
      try {
        const res = await api.post("/deleteproduct", {
          id,
        });
        return res.data;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
