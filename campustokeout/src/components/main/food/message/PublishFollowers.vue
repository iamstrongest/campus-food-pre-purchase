<script lang='ts' setup>
import { localstroageUser } from '@/stores/user/localstroage.js'
import { publishConments } from '@/utils/axios/api/dialogue'
import { useDate } from '@/hooks/useDate'
import { landlordStore } from "@/stores/user/landlordList"
import useMove from '@/hooks/useMove.js'
const useLandlordStore = landlordStore();
const props = defineProps(["url"]);
const localUserStore = localstroageUser();
// 发表评论的信息
const txt = ref();
// 传输的对象
const object = reactive({});
const cancle = () => {
    localUserStore.cancleShowFollowersConmentHande();
}
const publish = async () => {
    localUserStore.demoList.date = useDate();
    localUserStore.demoList.conment = txt.value;
    object.value = localUserStore.demoList;
    await publishConments(props.url, object.value);
    //总体来说说，有缺陷，本来应该重新渲染该回复级别的点赞数据，但是不好在进行更改了，因此重新渲染此页数据
    await useLandlordStore.getLandlordListHandle(`conments/landlord/foodId/${localUserStore.demoList.foodId}/page/${useLandlordStore.page}`);
    localUserStore.cancleShowFollowersConmentHande();
}

onMounted(() => {
    useMove("followersMask");
})
</script>
<template>
    <div class="mask">
        <div class="publish-container" id="followersMask">
            <img :src="localUserStore.userInfo.imageUrl" alt="">
            <textarea v-model="txt" placeholder="@回复"></textarea>
            <button @click="publish">发布</button>
            <div class="pointer" @click="cancle">取消</div>
        </div>
    </div>

</template>
  
<style scoped lang='less'>
.mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 4;

    .publish-container {
        display: flex;
        position: fixed;
        top: 50%;
        left: 50%;
        width: 1000rem;
        height: 200rem;
        align-items: center;
        background-color: #ccc;
        border: 1px solid hotpink;
        cursor: move;
        transform: translate(-50%, -50%);

        img {
            display: block;
            width: 100rem;
            height: 100rem;
            margin: 0 30rem;
            border-radius: 50%;
        }

        button {
            width: 100rem;
            height: 50rem;
            font-size: 30rem;
            background-color: skyblue;
            margin-right: 30rem;
            color: #fff;
        }

        .pointer {
            display: flex;
            width: 100rem;
            height: 50rem;
            cursor: pointer;
            align-items: center;
            justify-content: center;
            margin-right: 30rem;
            font-size: 30rem;
            background-color: #4ec9b0;
            color: #fff;
            border: 1rem solid #ccc;

        }

        textarea {
            flex: 1;
            height: 100%;
            margin: 0 30rem;
            outline: none;
            border-radius: 5rem;
            resize: none;
            font-size: 20rem;
            border: 1rem solid #ccc;
        }
    }
}
</style>