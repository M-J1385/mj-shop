import AddCategory from "@/components/AddCategory.vue";
import AddProduct from "@/components/AddProduct.vue";
import ChooseAddress from "@/components/ChooseAddress.vue";
import DeleteCategory from "@/components/DeleteCategory.vue";
import DeleteProduct from "@/components/DeleteProduct.vue";
import EditProduct from "@/components/EditProduct.vue";
import LoginForm from "@/components/LoginForm.vue";
import SignupForm from "@/components/SignupForm.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import AdminView from "@/views/AdminView.vue";
import AuthenticationView from "@/views/AuthenticationView.vue";
import CategoriesView from "@/views/CategoriesView.vue";
import CategoryView from "@/views/CategoryView.vue";
import HomeView from "@/views/HomeView.vue";
import NotFountView from "@/views/NotFountView.vue";
import ProductsView from "@/views/productsView.vue";
import SearchView from "@/views/SearchView.vue";
import SingleProductView from "@/views/SingleProductView.vue";
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/admin",
    component: AdminLayout,
    name: "adminlayout",
    children: [
      {
        path: "",
        component: AdminView,
        name: "adminview",
      },
      {
        path: "addproduct",
        component: AddProduct,
        name: "addproduct",
      },
      {
        path: "add-category",
        component: AddCategory,
        name: "addcategory",
      },
      {
        path: "edit-product",
        component: EditProduct,
        name: "editproduct",
      },
      {
        path: "editform/:id",
        component: AddProduct,
        name: "editform",
      },
      {
        path: "delete-product",
        component: DeleteProduct,
        name: "deleteproduct",
      },
      {
        path: "delete-category",
        component: DeleteCategory,
        name: "deletecategory",
      },
    ],
  },
  {
    path: "/",
    component: MainLayout,
    name: "mainlayout",
    children: [
      {
        path: "",
        name: "home",
        component: HomeView,
      },
      {
        path: "authentication",
        name: "auth",
        component: AuthenticationView,
        children: [
          {
            path: "",
            component: LoginForm,
            name: "mainauth",
          },
          {
            path: "login",
            component: LoginForm,
            name: "login",
          },
          {
            path: "signup",
            component: SignupForm,
            name: "signup",
          },
          {
            path: "address",
            component: ChooseAddress,
            name: "address",
          },
        ],
      },
      {
        path: "product/:id/:title",
        name: "product",
        component: SingleProductView,
      },
      {
        path: "search",
        name: "search",
        component: SearchView,
      },
      {
        path: "products",
        component: ProductsView,
        name: "products",
      },
      {
        path: "categories/:cat",
        component: CategoryView,
        name: "category",
      },
      {
        path: "categories",
        component: CategoriesView,
        name: "categories",
      },
      {
        path: ":pathMatch(.*)*",
        component: NotFountView,
        name: "notfound",
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0 };
  },
});

export default router;
