<script lang="ts" setup>
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
} from '@element-plus/icons-vue'
import { getFoodList, getShopList, getShopAllFood } from '@/utils/axios/api/food/aboutFood';
import { foodListStore } from '@/stores/foodList';
const foodStore = foodListStore();
const handleOpen = (key, keyPath) => {
    console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
    console.log(key, keyPath)
}
const router = useRouter();
const getAllItem = async () => {
    // 渲染所有食物列表
    const { data: res } = await getFoodList('foodlist');
    foodStore.foodList = res.data;
    router.push({
        path: "/fooditem"
    })
}
const goItem = async () => {
    router.push({
        path: "/fooditem"
    })
}
// 查询该商店所有食物，以及分类
const getThisShopAllFood = async (shopName) => {
    const { data: res } = await getShopAllFood('foodlist/shop', shopName);
    res.data.length == 0 ? alert("网络繁忙导致加载异常,请重新点击,发送请求!") : foodStore.foodList = res.data;
    foodStore.kind = res.kind;
    goItem();
}

onBeforeMount(async () => {
    // 渲染食物列表
    const { data: res } = await getShopList('foodlist/shopName');
    foodStore.shopNameList = res.data;
})
</script>
<template>
    <el-row class="tac">
        <el-col :span="22">
            <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
                router="true" unique-opened="true">
                <el-sub-menu @click="getAllItem">
                    <template #title>
                        <el-icon>
                            <location />
                        </el-icon>
                        <span class="big skyblue">所有食物</span>
                    </template>
                </el-sub-menu>
                <el-sub-menu v-for="(item) in foodStore.shopNameList" :key="item" @click="getThisShopAllFood(item)">
                    <template #title>
                        <el-icon>
                            <location />
                        </el-icon>
                        <span class="big skyblue">{{item}}</span>
                    </template>
                    <!-- <el-menu-item-group title="食物分类">
                        <el-menu-item index="/login" v-for="(item) in foodStore.kind">{{item}}</el-menu-item>
                    </el-menu-item-group> -->
                </el-sub-menu>
            </el-menu>
        </el-col>
    </el-row>
</template>

<style scoped lang="less">
.tac {
    height: 100%;
    width: 100%;
}

.el-col-12 {
    max-width: 100%
}

.skyblue {
    color: skyblue;
    font-size: 20rem;
}
</style>