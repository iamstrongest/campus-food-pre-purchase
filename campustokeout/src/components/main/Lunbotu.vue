<script lang='ts' setup>
import { uploadTimeMax, viewsMax, collecttionMax, giveThumbsMax } from "@/utils/axios/api/food/aboutFood"
import Swiper from "./Swiper.vue"
import { viewFood } from '@/utils/axios/api/food/aboutFood';
import { localstroageUser } from '@/stores/user/localstroage';
import { addViews } from '@/utils/axios/api/user'
import { useDateNow } from "@/hooks/useDate"
import { foodDetailsStore } from '@/stores/foodDetails'
const detailsStore = foodDetailsStore();
const localUserStore = localstroageUser();
const FoodList = ref([]);
const showImagesNumber = ref(6);
const router = useRouter();
onBeforeMount(async () => {
    const { data: res } = await viewsMax(`view/foodlist/?showNumber=${showImagesNumber.value}`);
    FoodList.value = res.data;
});
const addView = async (shopId, foodId) => {
    // 更新浏览时间
    await addViews('user/add', foodId, localUserStore.loginId, useDateNow());
    router.push(`/fooddetails/shopId/${shopId}/foodId/${foodId}`)
}
const showViewed = async () => {
    const { data: res } = await viewsMax(`view/foodlist/?showNumber=${showImagesNumber.value}`);
    FoodList.value = res.data;
}
const showUploaded = async () => {
    const { data: res } = await uploadTimeMax(`upload/foodlist/?showNumber=${showImagesNumber.value}`);
    FoodList.value = res.data;
}
const showGiven = async () => {
    const { data: res } = await giveThumbsMax(`giveThumbs/foodlist/?showNumber=${showImagesNumber.value}`);
    FoodList.value = res.data;
}
const showCollectd = async () => {
    const { data: res } = await collecttionMax(`collect/foodlist/?showNumber=${showImagesNumber.value}`);
    FoodList.value = res.data;
}
</script>
<template>
    <ul class="type">
        <li @click="showViewed" class="wqe">浏览最多</li>
        <li @click="showUploaded">上传最新</li>
        <li @click="showGiven">点赞最多</li>
        <li @click="showCollectd">收藏最多</li>
    </ul>
    <el-carousel v-if="FoodList.length > 0" :initial-index="1" :interval="2000" height="300rem" type="card">
        <el-carousel-item v-for="item in FoodList" :key="item.foodId">
            <Swiper :key="item" :data="item" @click="addView(item.shopId, item.foodId)"></Swiper>
        </el-carousel-item>
    </el-carousel>
</template>
  
<style scoped lang="less">
.type {
    margin: 20rem auto;
    display: flex;
    width: 500rem;
    height: auto;
    justify-content: center;
    align-items: center;

    li {
        list-style: none;
        flex: 1;
        text-align: center;
        margin-right: 10rem;
        font-size: 25rem;
        font-weight: bold;

        &:hover {
            text-decoration: underline;
            color: red;
            cursor: pointer;
        }
    }
}

img {
    width: 100%;
    height: 100%;
}

.link {
    text-decoration: none;
}
</style>