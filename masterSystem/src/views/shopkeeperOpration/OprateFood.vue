<script setup>
import OprateFoodCard from '@/components/shopkeeper/OprateFoodCard.vue'
import { RouterLink, RouterView } from "vue-router"
import { foodStore } from "@/stores/shop.js"
const useFoodStore = foodStore();
</script>

<template>
    <div class="item-container">
        <OprateFoodCard v-for="item in useFoodStore.foodList" :key="item" :data="item">
        </OprateFoodCard>
    </div>
</template>

<style scoped lang='less'>
.item-container {
    width: 100%;
    height: auto;
    display: flex;
    flex-wrap: wrap;
}
</style>
