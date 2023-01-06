import { defineStore } from "pinia";
import {
  getLandlord,
  giveLandlordThumbs,
  getLandlordLength,
} from "@/utils/axios/api/dialogue";
export const landlordStore = defineStore({
  id: "landlord",
  state: () => {
    return {
      // 渲染的数据
      landlordList: [],
      // 每页的展示数据,默认展示一条
      pageSize: 1,
      // 一页的总数据
      totalLength: 0,
      // 当前页
      page: 1,
      // 楼主级别的最后一条的当前楼层
      landlordLastLord: 0,
    };
  },
  getters: {
    getCurrentPage: (state) => {
      return (page) => {
        state.page = page;
      };
    },
  },
  actions: {
    async getLandlordTotalLengthHandle(url) {
      const { data: res } = await getLandlordLength(url);
      this.totalLength = res.data.length;
      console.log(this.totalLength);
      this.landlordLastLord = res.landlordLastLord;
    },
    async getLandlordListHandle(url) {
      const { data: res } = await getLandlord(url);
      this.landlordList = res.data;
      this.pageSize = res.pageSize;
    },
    async giveLandlordThumbsHandle(
      giveLandlordThumbsUrl,
      loginId,
      getLandlordListUrl
    ) {
      await giveLandlordThumbs(giveLandlordThumbsUrl, loginId);
      const { data: res } = await getLandlord(getLandlordListUrl);
      this.landlordList = res.data;
    },
  },
  // 开启数据缓存
  persist: {
    enabled: true,
    strategies: [
      // 本地存储评论区楼主级别最高的楼层
      {
        key: "landlordLastLord",
        storage: localStorage,
        paths: ["landlordLastLord"],
      },
    ],
  },
});
