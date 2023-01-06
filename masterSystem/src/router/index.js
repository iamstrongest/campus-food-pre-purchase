import { createRouter, createWebHistory } from "vue-router";
import { foodStore } from "@/stores/shop.js";
import { managerStore } from "@/stores/manager.js";
import authorityRoutes from "@/router/authority";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "/",
      alias: "/login",
      component: () => import("@/views/Login.vue"),
    },
    {
      path: "/manager",
      name: "manager",
      component: () => import("@/views/Manager.vue"),
    },
    {
      path: "/shopkeeper",
      name: "shopkeeper",
      redirect: "/shopkeeper/foodlist",
      component: () => import("@/views/Shopkeeper.vue"),
      children: [
        {
          path: "foodlist",
          name: "foodlist",
          component: () => import("@/views/FoodList.vue"),
        },
        {
          path: "oprateFood",
          name: "oprateFood",
          component: () => import("@/views/shopkeeperOpration/OprateFood.vue"),
        },
        {
          path: "addFood",
          name: "addFood",
          component: () => import("@/views/shopkeeperOpration/AddFood.vue"),
        },
        {
          path: "updateFood",
          name: "updateFood",
          component: () => import("@/views/shopkeeperOpration/UpdateFood.vue"),
        },
        {
          path: "food/:foodId",
          name: "foodDetails",
          component: () => import("@/views/FoodDetails.vue"),
        },
      ],
    },
  ],
});
router.beforeEach((to, from, next) => {
  const useFoodStore = foodStore();
  const useManagerStore = managerStore();
  if (to.path in authorityRoutes) {
    if (useFoodStore.shopkeeperLogin) {
      next();
    } else {
      alert("您还未登录，没有访问权限");
      next("/");
    }
  } else if (to.path == "/manager") {
    if (useManagerStore.managerLogin) {
      next();
    } else {
      alert("您还未登录，没有访问权限");
      next("/");
    }
  } else {
    next();
  }
});
export default router;
