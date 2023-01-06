import { defineStore } from "pinia";
export const localstroageUser = defineStore({
  id: "localstroageUser",
  state: () => {
    return {
      isLogin: false,
      isShowLogin: false,
      isShowHistorySearch: false,
      isLoaddingAll: true,
      search: "",
      loginId: "",
      isShowLandlordConment: false,
      isShowFollowersConment: false,
      userInfo: {},
      collectData: [],
      viewData: [],
      lovesData:[],
      localstroageSearch: [
        "qwe",
        "asd",
        "面对疾风吧",
        "亚索",
        "蛤蟆",
        "清清",
        "预压",
        "蛤蟆1",
        "清清1",
        "预压1",
        "qwe1",
        "asd1",
        "面对疾风吧2qweqweqweqwe",
        "无语",
        "蟑螂",
        "校区",
        "牛牛",
        "蛙蛙",
        "小可爱",
      ],
      // 没用
      floors: 0,
      demoList: {
        floors: "",
        foodId: "",
        username: "",
        imageUrl: "",
        replyUsername: "",
      },
    };
  },
  getters: {
    getLoginStatus(state) {
      return state.islogin;
    },
    showFollowersComents(state) {
      return state.isShowFollowersConment;
    },
  },
  actions: {
    loginHandle() {
      this.isLogin = true;
    },
    loginOutHandle() {
      this.isLogin = false;
    },
    addLocalHistory(search) {
      this.localstroageSearch.unshift(search);
    },
    ShowLoginHandle() {
      this.isShowLogin = true;
    },
    ShowLandlordConmentHande() {
      this.isShowLandlordConment = true;
    },
    cancleShowLandlordConmentHande() {
      this.isShowLandlordConment = false;
    },
    ShowFollowersConmentHande() {
      this.isShowFollowersConment = true;
    },
    cancleShowFollowersConmentHande() {
      this.isShowFollowersConment = false;
    },
    closeShowLoginHandle() {
      this.isShowLogin = false;
    },
  },
  // 开启数据缓存
  persist: {
    enabled: true,
    strategies: [
      {
        key: "historySearch",
        storage: localStorage,
        paths: ["localstroageSearch"],
      },
      {
        key: "login",
        storage: localStorage,
        paths: ["isLogin", "loginId", "userInfo"],
      },
    ],
  },
});
