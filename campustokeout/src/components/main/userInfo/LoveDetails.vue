<script lang='ts' setup>
import { localstroageUser } from '@/stores/user/localstroage.js'
import { getLoves } from '@/utils/axios/api/user'
const localUserStore = localstroageUser();
const router = useRouter();
onBeforeMount(async () => {
    const { data: res } = await getLoves("user/love", localUserStore.userInfo.loves);
    localUserStore.lovesData = res.data;
})
const goDetails = (shopId, foodId) => {
    router.push({
        path: `/fooddetails/shopId/${shopId}/foodId/${foodId}`
    })
}
const AsyncComponentLove = defineAsyncComponent({
    loader: () => import('./Love.vue'),

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
    <div class="love-container">
        <h1>点赞记录</h1>
        <div class="all-food-love-container">
            <AsyncComponentLove class="love" v-for="(item) in localUserStore.lovesData" :key="item" :data="item"
                @click="goDetails(item.shopId,item.foodId)">
            </AsyncComponentLove>
        </div>
    </div>
</template>
    
<style scoped lang='less'>
h1 {
    text-align: center;
    font-size: 30rem;
    margin-bottom: 30rem;
}

.all-food-love-container {
    display: flex;
    width: 100%;
    flex-wrap: wrap;

    .love {
        margin: 10rem;
    }
}
</style>