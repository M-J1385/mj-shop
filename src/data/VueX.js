import { createStore } from "vuex";
import products from "./modules/products";
import shopCard from "./modules/shopCard";
import categories from "./modules/categories";
import api from "@/axios";

export const store = createStore({
  state() {
    return {
      user: null,
    };
  },
  mutations: {
    setuser(state, user) {
      // state.user = info;
      // sessionStorage.setItem("user", JSON.stringify(info));
      state.user = user;
    },
    LOGOUT(state) {
      state.user = null;
    },
    // setusers(state, info) {
    //   state.users = info;
    // },
  },
  getters: {
    // isadmin(state) {
    //   return state.user && state.user.userlogin && state.user.useradmin;
    // },
    // islogin(state) {
    //   return state.user && state.user.userlogin;
    // },
    // getuser(state) {
    //   return state.user;
    // },
    // getusers(state) {
    //   return state.users;
    // },
    isadmin(state) {
      return state.user?.useradmin === 1;
    },
    islogin: (state) => !!state.user,
    getuser: (state) => state.user,
  },
  actions: {
    async checkLogin({ commit }) {
      try {
        const res = await api.get("/checklogin", {
          withCredentials: true,
        });
        if (res.data.status == "success") {
          commit("setuser", res.data.user);
        } else {
          commit("LOGOUT");
        }
      } catch {
        commit("LOGOUT");
      }
    },
    async logout({ commit }) {
      try {
        const res = await api.post(
          "/logout",
          {},
          { withCredentials: true }
        );
        commit("LOGOUT");
        return res.data;
      } catch (err) {
        console.log(err);
      } finally {
        commit("LOGOUT");
      }
    },
    async login({ dispatch }, { username, password }) {
      try {
        const res = await api.post(
          "/login",
          { username, password },
          { withCredentials: true }
        );
        await dispatch("checkLogin");
        return res.data;
      } catch (err) {
        console.log(err);
      }
    },
    // logout(state, info) {
    //   state.commit("setuser", info);
    //   state.commit("clearshopcart");
    // },
    async fetchuser(state) {
      try {
        const res = await api.get("/users");
        state.commit("setuser", res.data);
      } catch (err) {
        console.log("خطا", err);
      }
    },
    async getskills(state, id) {
      try {
        const res = await api.get(
          `/getskills?proid=${id}`
        );
        return res.data;
      } catch (err) {
        console.log(err);
      }
    },
    async addskills(state, values) {
      try {
        const formdata = new FormData();
        formdata.append("id", values.id);
        formdata.append("skills", JSON.stringify(values.skills));
        await api.post("/addtoskills", formdata);
      } catch (err) {
        console.log(err);
      }
    },
  },
  modules: {
    products,
    shopCard,
    categories,
  },
});
