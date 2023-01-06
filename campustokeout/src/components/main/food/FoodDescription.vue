<script lang="ts" setup>
import { localstroageUser } from "@/stores/user/localstroage.js";
import { foodDetailsStore } from "@/stores/foodDetails";
import { foodDetail } from "@/utils/axios/api/food/aboutFood";
import { getUserInfo } from '@/utils/axios/api/user'
import { viewFood } from '@/utils/axios/api/food/aboutFood';
// 使用store
const localUserStore = localstroageUser();
const detailsStore = foodDetailsStore();
const route = useRoute();
// 所有ref
const isLove = ref("点赞");
const isCollect = ref("收藏");

// 所有reactive
const about_user_food = reactive({
    loveToRed: false,
    collectToRed: false,
});
// 生命周期函数
onBeforeMount(async () => {
    // 先更新浏览数
    // await viewFood(`foodlist/foodId/${detailsStore.choice.foodId}`, detailsStore.choice.viewNumber);
    // // 重新更新要查看的食物数据
    // await detailsStore.getChooseHandle(`foodlist/shopId/${detailsStore.choice.shopId}/foodId/${detailsStore.choice.foodId}`);
    // const { data } = await foodDetail(
    //     `foodlist/shopId/${route.params.shopId}/foodId/${route.params.foodId}`
    // );
    // detailsStore.choice = data;
    // console.log(detailsStore.choice);
    // 首次进入直接判断
    isLoveToRed();
    // 首次进入直接判断
    isCollectToRed();
});

// 所有function

// 判断当前登录的id是否点赞过
function isLoveToRed() {

    detailsStore.choice.giveUserThumbs.some(
        (item) => item == localUserStore.loginId
    )
        ? (about_user_food.loveToRed = true)
        : (about_user_food.loveToRed = false);

}

// 判断当前登录的id是否点收藏过
function isCollectToRed() {

    detailsStore.choice.giveUserCollection.some(
        (item) => item == localUserStore.loginId
    )
        ? (about_user_food.collectToRed = true)
        : (about_user_food.collectToRed = false)
}

const isgiveThumbs = async () => {
    if (localUserStore.isLogin) {
        await detailsStore.changeUserGiveFoodThumbsHandle(
            `foodlist/foodId/${detailsStore.choice.foodId}/giveThumbs`,
            localUserStore.loginId,
            detailsStore.choice.shopId,
            detailsStore.choice.foodId
        );
        // 重新给chioce赋值后,重新判断点击点赞功能,是否点赞
        isLoveToRed();
        const { data: response } = await getUserInfo(`users/${localUserStore.loginId}`);
        localUserStore.userInfo = response;
    } else {
        alert('请先登录后再点赞');
    }

};
const isGiveCollection = async () => {
    if (localUserStore.isLogin) {
        // 点击收藏,发起更新操作,然后重新给chioce赋值
        await detailsStore.changeUserCollectFoodThumbsHandle(
            `/foodlist/foodId/${detailsStore.choice.foodId}/collect/`,
            localUserStore.loginId,
            detailsStore.choice.shopId,
            detailsStore.choice.foodId
        );
        const { data: response } = await getUserInfo(`users/${localUserStore.loginId}`);
        localUserStore.userInfo = response;
        // 重新给chioce赋值后,接着重新判断收藏功能,是否收藏
        isCollectToRed();
    } else {
        alert('请先登录后再收藏');
    }
};
</script>
<template>
    <div class="description-container">
        <div class="des-left">
            <img :src="detailsStore.choice.foodImageUrl" alt="" />
        </div>
        <div class="des-center">
            <p>名称: {{ detailsStore.choice.title }}</p>
            <p>描述:{{ detailsStore.choice.description }}</p>
            <p>店家:{{ detailsStore.choice.shopName }}</p>
            <p>{{ detailsStore.choice.price }}</p>
        </div>
        <div class="des-right">
            <div>
                <!-- 点赞 -->
                <div @click="isgiveThumbs" class="pointer">
                    {{ isLove }}
                    <font-awesome-icon icon="fa-solid fa-heart" :class="{
                        toRed: about_user_food.loveToRed,
                    }" />
                </div>
                <!-- 收藏 -->
                <div @click="isGiveCollection" class="pointer">
                    {{ isCollect }}
                    <font-awesome-icon icon="fa-solid fa-cart-plus" :class="{ toRed: about_user_food.collectToRed }" />
                </div>
            </div>
            <div class="nums">
                <span>点赞次数
                    <font-awesome-icon icon="fa-solid fa-heart" />
                    &nbsp;{{ detailsStore.choice.giveUserThumbsNumber }}
                </span>
                <span>收藏次数
                    <font-awesome-icon icon="fa-solid fa-cart-plus" />
                    &nbsp;{{ detailsStore.choice.giveUserCollectionNumber }}
                </span>
                <span>浏览次数
                    <font-awesome-icon icon="fa-solid fa-eye" />&nbsp;{{
        detailsStore.choice.viewNumber
                    }}
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
.description-container {
    width: 100%;
    height: 350rem;
    display: flex;

    div {
        flex: 1;
    }

    .des-left {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20rem;

        img {
            width: 80%;
            height: 80%;
        }
    }

    .des-center {
        flex-direction: column;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        padding: 20rem;

        p {
            flex: 1;
            padding: 2rem;
        }

        p:nth-child(4) {
            &::before {
                content: "单价￥:";
            }
        }
    }

    .des-right {
        flex-direction: column;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20rem;

        div {
            flex: 1;
        }

        .nums {
            display: flex;
            flex-direction: column;

            span {
                flex: 1;
            }
        }
    }
}

.pointer {
    cursor: pointer;
}

.toRed {
    color: pink;
}
</style>
