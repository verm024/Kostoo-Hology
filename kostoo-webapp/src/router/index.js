import Vue from "vue";
import VueRouter from "vue-router";
import firebase from "../firebase";
import store from "../store";
import Home from "../views/Home.vue";
import DashboardInvestor from "../views/Dashboard/Investor";
import DashboardDesa from "../views/Dashboard/Desa";
import CariDesa from "../views/CariDesa";
import Proyek from "../views/Proyek";
import DetailDesa from "../views/DetailDesa";
import FormKerjasama from "../views/FormKerjasama";
import Login from "../views/Auth/Login";
import Register from "../views/Auth/Register";
import Profile from "../views/Profile";
import Pesan from "../views/Pesan";
import DetailPesan from "../views/DetailPesan";

Vue.use(VueRouter);

const routes = [
  {
    path: "",
    name: "Home",
    component: Home,
    meta: {
      title: "Home",
      navCategory: "proyek"
    },

    children: [
      {
        path: "investor",
        component: DashboardInvestor,
        name: "Dashboard Investor",
        meta: {
          requiresLogin: true,
          allowedRole: "investor",
          title: "Dashboard",
          navCategory: "proyek"
        }
      },
      {
        path: "desa",
        component: DashboardDesa,
        name: "Dashboard Desa",
        meta: {
          requiresLogin: true,
          allowedRole: "desa",
          title: "Dashboard",
          navCategory: "proyek"
        }
      },
      {
        path: "cari-desa",
        component: CariDesa,
        name: "Cari Desa",
        meta: {
          requiresLogin: true,
          allowedRole: "investor",
          title: "Cari Desa",
          navCategory: "cari"
        }
      },
      {
        path: "proyek/:id",
        component: Proyek,
        name: "Detail Proyek",
        meta: {
          requiresLogin: true,
          allowedRole: "investor+desa",
          title: "Detail Proyek",
          navCategory: "proyek"
        }
      },
      {
        path: "desa/:id",
        component: DetailDesa,
        name: "Detail Desa",
        meta: {
          requiresLogin: true,
          allowedRole: "investor+desa",
          title: "Detail Desa",
          navCategory: "cari+portofolio"
        }
      },
      {
        path: "form-kerjasama/:id",
        component: FormKerjasama,
        name: "Form Kerjasama",
        meta: {
          requiresLogin: true,
          allowedRole: "investor",
          title: "Ajukan Kerjasama",
          navCategory: "cari"
        }
      },
      {
        path: "profile",
        component: Profile,
        name: "Profile",
        meta: {
          requiresLogin: true,
          allowedRole: "investor+desa",
          title: "Profile",
          navCategory: "profile"
        }
      },
      {
        path: "pesan",
        component: Pesan,
        name: "Pesan",
        meta: {
          requiresLogin: true,
          allowedRole: "investor+desa",
          title: "Pesan",
          navCategory: "pesan"
        }
      },
      {
        path: "pesan/:id",
        component: DetailPesan,
        name: "Detail Pesan",
        meta: {
          requiresLogin: true,
          allowedRole: "investor+desa",
          title: "Pesan",
          navCategory: "pesan"
        }
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "Login"
    }
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      title: "Register"
    }
  },
  {
    path: "*",
    name: "Unavailable"
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth.currentUser;
  let requiresLogin = to.matched.some(x => x.meta.requiresLogin);
  if (to.name == "Unavailable") {
    next("/" + store.state.userProfile.role);
  } else {
    if (currentUser) {
      if (requiresLogin) {
        if (to.meta.allowedRole.includes(store.state.userProfile.role)) {
          next();
        } else {
          next("/" + store.state.userProfile.role);
        }
      } else {
        if (to.name == "Register" || to.name == "Login") {
          next("/" + store.state.userProfile.role);
        } else if (to.name == "Home") {
          next("/" + store.state.userProfile.role);
        } else {
          next();
        }
      }
    } else {
      if (requiresLogin) {
        next("/login");
      } else {
        if (to.name == "Home") {
          next("/login");
        } else {
          next();
        }
      }
    }
  }
});

export default router;
