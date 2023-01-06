<script lang='ts' setup>
import { replyStore } from "@/stores/user/replyList"
import { localstroageUser } from '@/stores/user/localstroage'
import { foodDetailsStore } from '@/stores/foodDetails'
// import PublishFollowers from './PublishFollowers.vue'
import { landlordStore } from "@/stores/user/landlordList"
const useLandlordStore = landlordStore();
const props = defineProps(['data', 'floor']);
const useReplyStore = replyStore();
const useLocalstore = localstroageUser();
const detailsStore = foodDetailsStore();
const loveToRed = ref(false);
const sendData = reactive(
    {
        floors: useLocalstore.floors,
        foodId: props.data.foodId,
        username: useLocalstore.userInfo.username,
        imageUrl: useLocalstore.userInfo.imageUrl,
        replyUsername: props.data.username,
    }
)
const giveReplyThumbs = async (e) => {
    e.stopPropagation();
    await useReplyStore.giveReplyThumbsHandle(`foodlist/reply/replyConmentId/${props.data.replyConmentId}/update`,
        useLocalstore.loginId,
        `conments/reply/foodId/${detailsStore.choice.foodId}/floors/${props.floor}/page/${useReplyStore.page}`
    )
    // 重新渲染该此页所有数据，总体来说说，有缺陷，但是不好在进行更改了
    await useLandlordStore.getLandlordListHandle(`conments/landlord/foodId/${props.data.foodId}/page/${useLandlordStore.page}`);
    isLoveToRed();
}

// 判断当前登录的id是否给回复者点赞过
function isLoveToRed() {
    props.data.giveReplyThumbs.some(
        (item) => item == useLocalstore.loginId
    ) ? (loveToRed.value = true) : (loveToRed.value = false);
}
const getId = (e) => {
    // 阻止该二级回复触发楼主级别功能，以及该二级回复本身的点击事件
    e.stopPropagation();
    // 记录点击的楼层号
    sendData.floors = props.floor;
    useLocalstore.demoList = sendData;
}
const reply = () => {
    useLocalstore.ShowFollowersConmentHande()
    useLocalstore.isLogin ? "" : ElMessage({
        message: "请先登录后再回复评论",
        type: "warning",
    })
}

onBeforeMount(() => {
    // 渲染直接判断当前登录的ID号有没有点赞过该回复楼层
    isLoveToRed();
})
</script>
<template>
    <div class="follower-container" @click="getId">
        <img :src="data.imageUrl" alt="">
        <div class="followers">
            <div class="followers-center">
                <h6>{{data.username}}</h6>
                <p><span class="replyName">@{{data.replyUsername}}:</span>{{data.conment}}</p>
            </div>
            <div class="followers-bottom">
                <span title="回复时间">
                    <font-awesome-icon icon="fa-solid fa-clock" />&nbsp {{data.date}}
                </span>
                <span title="点击回复" class="pointer" @click="reply">
                    回复
                    <font-awesome-icon icon="fa-solid fa-message" />
                </span>
                <!--避免楼主级别下的回复者多次渲染这个组件，如果有10条回复者，则会渲染10次这个TelePort.
                因为我们只想要渲染一次这个传输组件，因此将这个放在LeaveTalk组件中较为合适。
                怎么发现问题：移动发表二级回复弹出框，发现控制台element里面多了很多条这个元素
                因为很多个这个相同的元素，导致移动不了，从而发现问题，并且解决这个问题
                -->
                <!-- <Teleport to="body" v-if="useLocalstore.isShowFollowersConment">
                    <PublishFollowers url="conments/push/type/2"> </PublishFollowers>
                </Teleport> -->
                <span title="点赞" class="pointer" :class=" {toRed:loveToRed}" @click="giveReplyThumbs">
                    <font-awesome-icon icon="fa-solid fa-thumbs-up" /> &nbsp{{data.giveReplyThumbsNumber
                    }}
                </span>
            </div>
        </div>
    </div>
</template>
    
<style scoped lang='less'>
.follower-container {
    width: 100%;
    height: 150rem;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding-top: 20rem;

    img {
        width: 100rem;
        height: 100rem;
        margin-right: 20rem;
        margin-left: 100rem;
        border-radius: 50%;
    }

    .followers {
        display: flex;
        flex: 1;
        height: 100%;
        flex-direction: column;

        &-center {
            display: flex;
            flex: 2;
            flex-direction: column;

            p {
                flex: 2;
            }

            h6 {
                flex: 1;
                color: #ccc;
            }
        }

        &-bottom {
            flex: 1;
            display: flex;

            span {
                flex: 1;
                text-align: center;
            }

            .three {
                content: "￥";
            }
        }
    }
}

.replyName {
    color: skyblue;
}

.pointer {
    cursor: pointer;
}

.toRed {
    color: pink;
}
</style>