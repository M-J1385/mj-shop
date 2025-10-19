import api from "@/axios";
import Swal from "sweetalert2";

export default {
  state: {
    categories: [],
  },
  getters: {
    getcategory(state) {
      return state.categories;
    },
  },
  mutations: {
    setcat(state, info) {
      state.categories = info;
    },
  },
  actions: {
    async setcategory({ commit }) {
      const res = await api.get("/getcategory");
      commit("setcat", res.data);
    },
    async addtocat(state, values) {
      const formdata = new FormData();
      formdata.append("persiancat", values.persiancat);
      formdata.append("englishcat", values.englishcat);
      formdata.append("catimage", values.catimage);
      const res = await api.post("/addtocat", formdata);
      if (res.data.status == "success") {
        Swal.fire({
          title: "دسته بندی اضافه شد",
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
        return false;
      }
    },
    async deletecategory(state, values) {
      try {
        await api.post("/deletecategory", {
          cat: values.procat,
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
