import { userRoutes } from "./user/about.js";
const routes = [
  {
    path: "/",
    name: "/",
    component: () => import("@/views/Layout.vue"),
    redirect: "/home",
    alias: ["/index"],
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/components/main/Home.vue"),
      },
      {
        path: "fooditem",
        name: "fooditem",
        component: () => import("@/components/main/FoodItem.vue"),
      },
      {
        path: "/fooddetails/shopId/:shopId/foodId/:foodId",
        name: "fooddetails",
        component: () => import("@/components/main/food/FoodDetails.vue"),
      },
    ],
  },
  ...userRoutes,
];
export default routes;
