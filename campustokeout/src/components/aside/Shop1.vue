<script lang="ts" setup>
import { getFoodList, getShopList, getShopAllFood } from '@/utils/axios/api/food/aboutFood';
import { foodListStore } from '@/stores/foodList';
const foodStore = foodListStore();
const router = useRouter();
const ps = ref();
const getAllItem = async () => {
    // 渲染所有食物列表
    const { data: res } = await getFoodList('foodlist');
    foodStore.foodList = res.data;
    router.push({
        path: "/fooditem"
    })
}
const goItem = () => {
    router.push({
        path: "/fooditem"
    })
}

// 查询该商店所有食物，以及分类
const getThisShopAllFood = async (shopName, e) => {
    ps.value.forEach(item => {
        item.style.backgroundColor = "#fff";
    })
    e.target.style.backgroundColor = "#eff6ff";
    let data = [];
    const { data: res } = await getShopAllFood('foodlist/shop', shopName);
    data = res.data;
    foodStore.foodList = data;
    goItem();
}

onBeforeMount(async () => {
    // 渲染食物列表
    const { data: res } = await getShopList('foodlist/shopName');
    foodStore.shopNameList = res.data;
})
</script>
<template>
    <div class="aside-container">
        <div class="allFood" @click="getAllItem">所有食物</div>
        <ul>
            <li v-for="(item) in foodStore.shopNameList" :key="item" @click="getThisShopAllFood(item, $event)">
                <p ref="ps">
                    {{ item }}
                </p>
            </li>
        </ul>
    </div>
</template>

<style scoped lang="less">
.aside-container {
    width: 200rem;
    height: auto;
    color: #000;
    text-align: center;

    .allFood {
        width: 100%;
        height: 50rem;
        font-size: 30rem;
        margin: 30rem 0;
        cursor: pointer;

        &:hover {
            color: #42b868;
        }
    }

    ul {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: column;

        li {
            list-style: none;
            width: 100%;
            height: auto;
            margin: 30rem 0;
            cursor: pointer;

            &:hover {
                color: skyblue;
            }

            p {
                width: 100%;
                height: 40rem;
                font-size: 30rem;
            }

            div {
                width: 100%;
                height: 25rem;
                background-color: #000;
                font-size: 20rem;
            }
        }

    }
}
</style>