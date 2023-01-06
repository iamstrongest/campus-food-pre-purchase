import { defineStore } from "pinia";
import {
  getShopkeeperList,
  getChooseShopkeeperId,
  deleteShopkeeper,
  addShopkeeper,
  changeShopkeeper,
  managerLogin,
} from "@/utils/axios/api/manager/index";
export const managerStore = defineStore({
  id: "managerStore",
  state: () => {
    return {
      managerId: 0,
      managerLogin: false,
      shopkeeperList: [],
      oprateshopkeeper: {},
      oprateShopkeeperId: 0,
    };
  },
  getters: {},
  actions: {
    async getShopkeeperListHandle(url, id, password) {
      const { data: response } = await managerLogin(url, id, password);
      if (response.message == "登录成功") {
        const { data: res } = await getShopkeeperList("manager/all");
        this.shopkeeperList = res;
      }
      return response.message;
    },

    getChooseShopkeeperIdHandle(shopId) {
      this.oprateShopkeeperId = shopId;
    },
    async deleteShopkeeperHandle(url) {
      await deleteShopkeeper(url);
      const { data: res } = await getShopkeeperList("manager/all");
      this.shopkeeperList = res;
    },
    async addShopkeeperHandle(url) {
      await addShopkeeper(url);
      const { data: res } = await getShopkeeperList("manager/all");
      this.shopkeeperList = res;
    },
    async changeShopkeeperHandle(url, info) {
      await changeShopkeeper(url, info);
      const { data: res } = await getShopkeeperList("manager/all");
      this.shopkeeperList = res;
    },
  },
  persist: {
    // 开启数据缓存所选中的食物，防止按F5刷新页面数据丢失
    enabled: true,
    strategies: [
      {
        key: "manager",
        storage: localStorage,
        paths: [
          "managerId",
          "shopkeeperList",
          "oprateShopkeeperId",
          "oprateshopkeeper",
          "managerLogin",
        ],
      },
    ],
  },
});
