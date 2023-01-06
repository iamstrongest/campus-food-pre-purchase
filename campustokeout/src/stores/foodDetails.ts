import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { foodDetail,changeUserGiveFoodThumbs,changeUserCollectFoodThumbs} from '@/utils/axios/api/food/aboutFood'
export const foodDetailsStore = defineStore({
    id: "foodDetails",
    state: () => {
        return {
            choice : {

            }
        }
    },
    getters: {

    },
    actions: {
        async getChooseHandle(url: string) {
            const { data } = await foodDetail(url);
            this.choice = data;
        },
        async changeUserGiveFoodThumbsHandle(url: string, userId: number, shopId: number, foodId: number) {
            // 更新点赞总数
            await changeUserGiveFoodThumbs(url, userId);
            // 重新给choice赋值
            const { data } = await foodDetail(`foodlist/shopId/${shopId}/foodId/${foodId}`);
            this.choice = data;
        },
        async changeUserCollectFoodThumbsHandle(url: string, userId: number, shopId: number, foodId: number) {
            // 更新收藏食物总数
            await changeUserCollectFoodThumbs(url, userId);
            // 重新给choice赋值
            const { data } = await foodDetail(`foodlist/shopId/${shopId}/foodId/${foodId}`);
            this.choice = data;
        }
    },
  // 开启数据缓存所选中的食物，因为不缓存choice的foodId，按F5刷新页面，评论区的留言将不会展示，因为choice对象不存在foodId
  persist: {
    enabled: true,
    strategies: [
      {
        key: "choice",
        storage: localStorage,
        paths: ["choice"],
      },
    ],
  },
});
