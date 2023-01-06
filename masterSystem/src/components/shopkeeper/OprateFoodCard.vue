<script setup>
import { ref } from 'vue'
import { RouterLink } from "vue-router"
import { foodStore } from "@/stores/shop.js"
const props = defineProps(["data"]);
const useFoodStore = foodStore();
const isShow = ref(false);
const isDeleteShow = () => {
    isShow.value = true;

}
const getFoodId = (foodId) => {
    useFoodStore.oprateFoodId = foodId;
}
const confirm = () => {
    useFoodStore.deleteFoodHandle(`delete/shopkeeper/food/${useFoodStore.oprateFoodId}`);
    isShow.value = false;
}
const cancle = () => {
    isShow.value = false;
}
const getChoice = () => {
    useFoodStore.chooseFood = useFoodStore.foodList.filter(item => item.foodId == props.data.foodId);
    console.log(useFoodStore.chooseFood);
}
</script>


<template>
    <div class="card-container" @click="getFoodId(data.foodId)">
        <img :src="data.foodImageUrl" alt="">
        <div>
            <h3>{{data.title}}</h3>
            <button @click="isDeleteShow">点击删除</button>
            <button @click="getChoice">
                <router-link to="/shopkeeper/updateFood" class="link">更新信息</router-link>
            </button>
        </div>
    </div>
    <teleport to='body' v-if="isShow">

        <div class="mask">
            <div class="confirm">
                <p>
                <h2>
                    您真的想要删除该食物吗？
                </h2>
                <h2>
                    操作不可逆!
                </h2>
                </p>
                <button @click="confirm" class="sure">确认</button>
                <button @click="cancle" class="false">取消</button>
            </div>
        </div>
    </teleport>
</template>

<style scoped lang="less">
.card-container {
    margin: 20px 0 0 20px;
    width: 400px;
    height: 200px;
    display: flex;
    align-items: center;
    border: 1px solid #ccc;

    img {
        width: 150px;
        height: 100px;
    }

    div {
        align-self: start;
        margin-left: 10px;
        flex: 1;

        button {
            font-size: 20px;
            margin-right: 20px;
            color: #fff;
        }

        button:nth-of-type(1) {
            background-color: red;
        }

        button:nth-of-type(2) {
            background-color: #41b883;
        }

        .link {
            display: inline-block;
            width: 100%;
            height: 100%;
            color: #fff;
            text-decoration: none;
        }

        h3 {
            height: 50px
        }

        p {
            height: auto;
        }
    }

}

.mask {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.3);
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;

    .confirm {
        width: 500px;
        height: 200px;
        background-color: #fff;
        text-align: center;
        border-radius: 20px;

        button {
            width: 100px;
            height: 50px;
            color: #fff;
            margin-right: 20px;
            font-size: 30px;
        }

        .sure {
            background-color: red;
        }

        .false {
            background-color: blue;
        }
    }
}
</style>
