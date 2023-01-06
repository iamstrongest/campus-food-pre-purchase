<script setup>
import FoodCard from '@/components/shopkeeper/FoodCard.vue'
import { foodStore } from "@/stores/shop.js"
import { ref } from "vue"
const useFoodStore = foodStore();
</script>

<template>
    <div class="item-container" v-if="!useFoodStore.isloading">
        <FoodCard v-for="item in useFoodStore.foodList" :key="item" :data="item">
        </FoodCard>
    </div>
    <div v-else class="loading-center">

        页面加载中... <span class="loading">

        </span>
    </div>
</template>

<style scoped lang='less'>
.item-container {
    width: 100%;
    height: auto;
    display: flex;
    flex-wrap: wrap;
}

.loading-center {
    width: auto;
    height: auto;
    position: fixed;
    left: 50%;
    top: 50%;
    bottom: 0;
    right: 0;
    margin: auto;
}

.loading {
    display: inline-block;
    width: 0;
    height: 100px;
    background-color: skyblue;

    animation: toskyblue 0.5s linear;

    @keyframes toskyblue {
        0% {
            width: 0px;
        }

        50% {
            width: 200px;
        }

        100% {
            width: 0px;
        }
    }
}
</style>
