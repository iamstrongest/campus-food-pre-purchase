import { defineStore } from "pinia";
import {
  getReply,
  giveReplyThumbs,
  getReplyLength,
} from "@/utils/axios/api/dialogue";
export const replyStore = defineStore({
  id: "reply",
  state: () => {
    return {
      replyList: [],
      pageSize: 1,
      totalLength: 0,
      page: 1,
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
    async getReplyTotalLengthHandle(url) {
      const { data: res } = await getReplyLength(url);
      this.totalLength = res.data.length;
    },
    async getReplyListHandle(url) {
      const { data: res } = await getReply(url);
      this.replyList = res.data;
      this.pageSize = res.pageSize;
      return this.replyList;
    },
    async giveReplyThumbsHandle(giveReplyThumbsUrl, loginId, getReplyListUrl) {
      await giveReplyThumbs(giveReplyThumbsUrl, loginId);
      const { data: res } = await getReply(getReplyListUrl);
      this.replyList = res.data;
    },
  },
});
