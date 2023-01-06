<script setup>
import { onMounted, nextTick } from "vue"
import FoodCard from '@/components/shopkeeper/FoodCard.vue'
import { foodStore } from "@/stores/shop.js"
import * as echarts from 'echarts';
const useFoodStore = foodStore();
onMounted(async () => {
    await nextTick();
    var myChart = echarts.init(document.getElementById('des-echarts'));
    myChart.setOption({
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['收藏量', '点赞量', '浏览量']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [useFoodStore.chooseFood.giveUserCollectionNumber, useFoodStore.chooseFood.giveUserThumbsNumber, useFoodStore.chooseFood.viewNumber],
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            }
        ]
    });
})
</script>

<template>
    <div class="description-container">
        <div class="des-top">
            <div class="des-left">
                <img :src="useFoodStore.chooseFood.foodImageUrl" alt="" />
            </div>
            <div class="des-center">
                <p>名称: {{ useFoodStore.chooseFood.title }}</p>
                <p>描述:{{ useFoodStore.chooseFood.description }}</p>
                <p>店家:{{ useFoodStore.chooseFood.shopName }}</p>
                <p>{{ useFoodStore.chooseFood.price }}</p>
            </div>
        </div>
        <div id="des-echarts">

        </div>
    </div>
</template>

<style scoped lang="less">
.description-container {
    width: 100%;
    height: auto;

    .des-top {
        margin: 20px 0;
        width: 100%;
        display: flex;
        height: 200px;
        align-items: center;
        justify-content: space-around;

        .des-left {
            margin-left: 100px;
            width: 200px;
            height: 200px;
            margin-right: 100px;

            img {
                width: 100%;
                height: 100%;
            }
        }

        .des-center {
            flex-direction: column;
            display: flex;
            align-items: flex-start;
            justify-content: flex-start;

            p {
                flex: 1;
                padding: 2px;
            }

            p:nth-child(4) {
                &::before {
                    content: "单价￥:";
                }
            }
        }
    }


    #des-echarts {
        margin: 0 auto;
        height: 500px;
        width: 500px;
    }
}
</style>

