<script lang='ts' setup>
import { foodListStore } from '@/stores/foodList';
import { getFoodList, viewFood } from '@/utils/axios/api/food/aboutFood';
import { foodDetailsStore } from '@/stores/foodDetails'
import { useRouter } from 'vue-router';
import { localstroageUser } from '@/stores/user/localstroage.js'
import { addViews, getUserInfo } from '@/utils/axios/api/user'
import { useDateNow } from "@/hooks/useDate"
const localUserStore = localstroageUser();
const foodStore = foodListStore();
const router = useRouter();
const detailsStore = foodDetailsStore();
const goDetails = async (foodId, shopId) => {
    if (localUserStore.isLogin) {
        // 无浏览历史则添加，否则更新浏览食物时间
        await addViews('user/add', foodId, localUserStore.loginId, useDateNow());
        const { data: response } = await getUserInfo(`users/${localUserStore.loginId}`);
        localUserStore.userInfo = response;
    }
    //    路由跳转到点击食物的详细信息
    router.push({
        path: `/fooddetails/shopId/${shopId}/foodId/${foodId}`
    })
}

onBeforeMount(async () => {
    // 渲染所有食物列表
    const { data: res } = await getFoodList('foodlist');
    foodStore.foodList = res.data;
})

const AsyncComponentFoodCard = defineAsyncComponent({
    loader: () => import('@/components/main/FoodCard.vue'),

    // // 加载异步组件时使用的组件
    loadingComponent: () => import('@/components/asyncComp/Loading.vue'),
    // 展示加载组件前的延迟时间，默认为 200ms
    delay: 3000,

    // 加载失败后展示的组件
    errorComponent: Infinity,
    // 如果提供了一个 timeout 时间限制，并超时了
    // 也会显示这里配置的报错组件，默认值是：Infinity
    timeout: 3000
})
</script>
<template>
    <div>
    </div>
    <div class="foodItem-container">
        <AsyncComponentFoodCard
            v-for="(item) in foodStore.searchArray.length > 0 ? foodStore.searchArray : foodStore.foodList"
            :key="item.foodId" :data='item' @click="goDetails(item.foodId, item.shopId)">
        </AsyncComponentFoodCard>

    </div>
</template>

<style scoped lang='less'>
.foodItem-container {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 20rem 0;

    .black {
        color: black;
    }
}
</style>