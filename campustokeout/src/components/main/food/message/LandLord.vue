<script lang='ts' setup>
import { landlordStore } from "@/stores/user/landlordList"
import { replyStore } from "@/stores/user/replyList"
import { localstroageUser } from '@/stores/user/localstroage'
import { foodDetailsStore } from '@/stores/foodDetails'
const props = defineProps(['data', "key"]);
// stores
const useLandlordStore = landlordStore();
const useLocalstore = localstroageUser();
const detailsStore = foodDetailsStore();
const useReplyStore = replyStore();

// 点赞的样式
let loveToRed = ref(false);

let replyDataList = ref([]);
const isshowFollower = ref(false);
//element ref
const currentPage = ref(1);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
const sendData = reactive(
    {
        floors: useLocalstore.floors,
        foodId: props.data.foodId,
        username: useLocalstore.userInfo.username,
        imageUrl: useLocalstore.userInfo.imageUrl,
        replyUsername: props.data.username,
    }
)
onBeforeMount(async () => {
    await useReplyStore.getReplyTotalLengthHandle(`conments/reply/foodId/${props.data.foodId}/floors/${props.data.floors}`)
    //  await useReplyStore.getReplyListHandle(`conments/reply/foodId/${props.data.foodId}/floors/${props.data.floors}/page/1`);
    replyDataList.value = await useReplyStore.getReplyListHandle(`conments/reply/foodId/${props.data.foodId}/floors/${props.data.floors}/page/1`);
    isLoveToRed();
})

// 给楼主级别点赞
const giveLandlordThumbs = async (e) => {
    e.stopPropagation();
    await useLandlordStore.giveLandlordThumbsHandle(`foodlist/landlord/${props.data.floors}/update`,
        useLocalstore.loginId,
        `conments/landlord/foodId/${detailsStore.choice.foodId}/page/${useLandlordStore.page}`
    );
    isLoveToRed();
}
// 判断当前登录的id是否给楼主点赞过
function isLoveToRed() {
    props.data.giveLandlordThumbs.some(
        (item) => item == useLocalstore.loginId
    ) ? (loveToRed.value = true) : (loveToRed.value = false);
}

const showFollower = () => {
    isshowFollower.value = true;
    useLocalstore.ShowFollowersConmentHande();
    useLocalstore.isLogin ? "" : ElMessage({
        message: "请先登录后再回复评论",
        type: "warning",
    })
}

const getId = () => {
    sendData.floors = props.data.floors;
    useLocalstore.demoList = sendData;
}

const AsyncComponentFollows = defineAsyncComponent({
    loader: () => import('./Followers.vue'),

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

//element function
const handleCurrentChange = async (val) => {
    replyDataList.value = await useReplyStore.getReplyListHandle(`conments/reply/foodId/${props.data.foodId}/floors/${props.data.floors}/page/${val}`);
    useReplyStore.getCurrentPage(val);
}
</script>
<template>
    <div class="land-lord-container" @click="getId" :id="`landlord${props.data.floors}`">
        <img :src="data.imageUrl" alt="">
        <div class="land-lord-right">
            <h5>{{data.username}}</h5>
            <p>{{data.conment}}</p>
            <div class="land-lord-right-bottom">
                <span title="发表时间">
                    <font-awesome-icon icon="fa-solid fa-clock" />&nbsp {{data.date}}
                </span>
                <span class="three pointer" title="点击回复" @click="showFollower">
                    回复
                    <font-awesome-icon icon="fa-solid fa-message" />
                </span>
                <!--避免楼主级别多次渲染这个组件，如果有10条回复者，则会渲染10次这个TelePort.
                因为我们只想要渲染一次这个传输组件，因此将这个放在LeaveTalk组件中较为合适。
                怎么发现问题：点击回复楼主级别评论，移动二级回复弹出框时，发现控制台element里面多了很多条这个元素
                因为很多个这个相同的元素，导致移动不了，从而发现问题，并且解决这个问题
                -->
                <!-- <Teleport to="body" v-if="useLocalstore.isShowFollowersConment">
                    <PublishFollowers url="conments/push/type/2"></PublishFollowers>
                </Teleport> -->
                <span title="点赞 " class="pointer" :class=" {toRed:loveToRed}" @click="giveLandlordThumbs">
                    <font-awesome-icon icon="fa-solid fa-thumbs-up" /> &nbsp{{data.giveLandlordThumbsNumber
                    }}
                </span>
            </div>
        </div>
    </div>
    <div class="followers-container">

        <!-- <Followers v-for="(item) in useReplyStore.replyList" :key="item" :data="item" :floor="props.data.floors">
        </Followers> -->
        <AsyncComponentFollows v-for="(item) in replyDataList" :key="item" :data="item" :floor="props.data.floors">
        </AsyncComponentFollows>
        <div v-if="useReplyStore.replyList.length" class="demo-pagination-block">
            <el-pagination v-if="replyDataList.length" v-model:currentPage="currentPage" :small="small"
                :disabled="disabled" :background="background" layout="prev, pager, next, jumper"
                :page-size="useReplyStore.pageSize" :total="useReplyStore.totalLength"
                @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<style scoped lang='less'>
.land-lord-container {
    width: 100%;
    height: 150rem;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;

    img {
        width: 100rem;
        height: 100rem;
        margin-right: 20rem;
        border-radius: 50%;
    }

    .land-lord-right {
        display: flex;
        flex: 1;
        height: 100%;
        flex-direction: column;

        h5 {
            flex: 1;
            color: #ccc;
        }

        p {
            flex: 2;
        }

        &-bottom {
            flex: 1;
            display: flex;

            span {
                flex: 1;
                text-align: center;
            }

            .three {
                width: 100rem;
            }
        }
    }
}

.followers-container {
    border: 1rem solid #ccc;
    border-bottom: 0;
    margin-bottom: 100rem;
}

.demo-pagination-block {
    padding-left: 40%;
}

.pointer {
    cursor: pointer;
}

.toRed {
    color: pink;
}
</style>