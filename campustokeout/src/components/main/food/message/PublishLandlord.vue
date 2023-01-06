<script lang='ts' setup>
import { localstroageUser } from '@/stores/user/localstroage.js'
import { publishConments } from '@/utils/axios/api/dialogue'
import { landlordStore } from "@/stores/user/landlordList"
import { useDate } from '@/hooks/useDate'
import useMove from '@/hooks/useMove.js'
const props = defineProps(["data", "url"]);
const localUserStore = localstroageUser();
const useLandlordStore = landlordStore();
const txt = ref();
const publish = async () => {
    const data = props.data;
    data.date = useDate();
    data.conment = txt.value;
    // 发布
    await publishConments(props.url, data);
    localUserStore.cancleShowLandlordConmentHande();
    //    更新楼主级别的评论
    await useLandlordStore.getLandlordTotalLengthHandle(`conments/landlord/foodId/${props.data.foodId}`);
    await useLandlordStore.getLandlordListHandle(`conments/landlord/foodId/${props.data.foodId}/page/1`);

}
onMounted(() => {
    useMove("landlordMask");
})
</script>
<template>
    <div class="mask">
        <div class="publish-container" id="landlordMask">
            <img :src="localUserStore.userInfo.imageUrl" alt="">
            <textarea v-model="txt" placeholder="请输入内容,发布一条评论吧"></textarea>
            <button @click="publish">发布</button>
            <div class="pointer" @click="localUserStore.cancleShowLandlordConmentHande()">取消</div>
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