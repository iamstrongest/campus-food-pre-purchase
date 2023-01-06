<script lang='ts' setup>
import { localstroageUser } from '@/stores/user/localstroage.js'
import { getViews } from '@/utils/axios/api/user'
const localUserStore = localstroageUser();
const router = useRouter();
onBeforeMount(async () => {
    const { data: res } = await getViews("user/views", localUserStore.userInfo.views, localUserStore.loginId);
    localUserStore.viewData = res.data;
})
const goDetails = (shopId, foodId) => {
    router.push({
        path: `/fooddetails/shopId/${shopId}/foodId/${foodId}`
    })
}
const AsyncComponentView = defineAsyncComponent({
    loader: () => import('./View.vue'),

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
    <div class="views-container">
        <h1>浏览记录</h1>
        <div class="all-food-views-container">
            <AsyncComponentView class="view" v-for="(item) in localUserStore.viewData" :key="item" :data="item"
                @click="goDetails(item.shopId,item.foodId)"></AsyncComponentView>
        </div>
    </div>
</template>

<style scoped lang='less'>
h1 {
    text-align: center;
    font-size: 30rem;
    margin-bottom: 30rem;
}

.all-food-views-container {
    display: flex;
    width: 100%;
    flex-wrap: wrap;

    .view {
        margin: 10rem;
    }
}
</style>