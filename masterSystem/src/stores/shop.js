import { ref, computed } from "vue";
import { defineStore } from "pinia";
import {
  shopkeeperLogin,
  foodList,
  deleteFood,
  addFood,
  changeFood,
  getChooseFood,
} from "@/utils/axios/api/shopkeeper/index";
export const foodStore = defineStore({
  id: "foodStore",
  state: () => {
    return {
      shopId: 0,
      shopkeeperLogin: false,
      foodList: [],
      chooseFood: {},
      oprateFoodId: 0,
    };
  },
  getters: {},
  actions: {
    async getChooseFoodHandle(url) {
      const { data: res } = await getChooseFood(url);
      this.chooseFood = res;
      console.log(this.chooseFood);
    },

    async getshopIdHandle(url, id, password) {
      const { data: res } = await shopkeeperLogin(url, id, password);
      this.shopId = res.shopId;
      this.shopName = res.shopName;
      const { data: foodArray } = await foodList(
        `get/shopkeeper/food/?shopId=${this.shopId}`
      );
      this.foodList = foodArray;
    },
    async deleteFoodHandle(url) {
      await deleteFood(url);
      const { data: foodArray } = await foodList(
        `get/shopkeeper/food/?shopId=${this.shopId}`
      );
      this.foodList = foodArray;
    },
    async addFoodHandle(url, foodDetails) {
      const {
        title,
        price,
        shopName,
        kind,
        description,
        campus,
        foodImageUrl,
      } = foodDetails;
      await addFood(
        url,
        this.shopId,
        title,
        shopName,
        price,
        kind,
        description,
        campus,
        foodImageUrl,
        Date.now()
      );
      const { data: foodArray } = await foodList(
        `get/shopkeeper/food/?shopId=${this.shopId}`
      );
      this.foodList = foodArray;
    },
    async changeFoodHandle(url, foodId, foodDetails) {
      const {
        title,
        shopName,
        price,
        kind,
        description,
        campus,
        foodImageUrl,
      } = foodDetails;
      await changeFood(
        url,
        foodId,
        title,
        shopName,
        price,
        kind,
        description,
        campus,
        foodImageUrl
      );
      const { data: foodArray } = await foodList(
        `get/shopkeeper/food/?shopId=${this.shopId}`
      );
      this.foodList = foodArray;
    },
  },
  persist: {
    // 开启数据缓存所选中的食物，防止按F5刷新页面数据丢失
    enabled: true,
    strategies: [
      {
        key: "food",
        storage: localStorage,
        paths: [
          "shopId",
          "chooseFood",
          "foodList",
          "oprateFoodId",
          "shopkeeperLogin",
        ],
      },
    ],
  },
});
