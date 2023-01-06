<script lang='ts' setup>
import { foodListStore } from '@/stores/foodList';
import { viewFood } from '@/utils/axios/api/food/aboutFood';
import { localstroageUser } from '@/stores/user/localstroage';
import { getViews, addViews } from '@/utils/axios/api/user'
import { useDateNow } from "@/hooks/useDate"
import { foodDetailsStore } from '@/stores/foodDetails'
const detailsStore = foodDetailsStore();
const localUserStore = localstroageUser();


const foodStore = foodListStore();

const addView = async (shopId, foodId, viewNumber) => {
  // 先更新浏览数
  await viewFood(`foodlist/foodId/${foodId}`, viewNumber);
  // 重新更新要查看的食物数据
  await detailsStore.getChooseHandle(`foodlist/shopId/${shopId}/foodId/${foodId}`);
  // 再更新浏览时间
  await addViews('user/add', foodId, localUserStore.loginId, useDateNow());
}
onBeforeMount(async () => {
  const { data: res } = await getViews("user/views", localUserStore.userInfo.views, localUserStore.loginId);
  localUserStore.viewData = res.data;
  console.log(localUserStore.viewData);
})
const AsyncComponentHoverHistory = defineAsyncComponent({
  loader: () => import('./watch/History.vue'),

  // // 加载异步组件时使用的组件
  loadingComponent: () => import('@/components/asyncComp/Loading.vue'),
  // 展示加载组件前的延迟时间，默认为 200ms
  delay: 200,

  // 加载失败后展示的组件
  errorComponent: Infinity,
  // 如果提供了一个 timeout 时间限制，并超时了
  // 也会显示这里配置的报错组件，默认值是：Infinity
  timeout: 3000
})
</script>
<template>
  <div class="history-hover-container">
    <!-- 默认展示6条数据 -->
    <AsyncComponentHoverHistory v-for="(item) in localUserStore.viewData.slice(0,6)" :key="item" :data="item"
      @click="addView(item.shopId,item.foodId,item.viewNumber)">
    </AsyncComponentHoverHistory>
    <p>
      <router-link to="/user/views" class="link">查看更多</router-link>
    </p>
  </div>
</template>

<style scoped lang='less'>
.history-hover-container {
  position: absolute;
  width: 500rem;
  height: 600rem;
  background-color: #fff;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  top: 0rem;
  left: -450rem;
  box-shadow: 0rem 1rem #86898f;
  border-radius: 10rem;
  overflow: auto;

  p {
    width: 100%;
    cursor: pointer;
    text-align: center;
    background-color: #2d2d2d;

    .link {
      color: #fff;
      text-decoration: none;

      &:hover {
        color: red;
        text-decoration: underline;
      }
    }
  }
}
</style>