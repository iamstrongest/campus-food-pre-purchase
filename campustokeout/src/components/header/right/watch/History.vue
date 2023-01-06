<script lang='ts' setup>
import { useDate } from "@/hooks/useDate"
const props = defineProps(['data']);
const goUrl = `/fooddetails/shopId/${props.data.shopId}/foodId/${props.data.foodId}`
console.log(props.data.viewLastTime);

const time = ref(useDate(props.data.viewLastTime));
</script>
<template>
    <div class="history-container">
        <h4>{{time}}</h4>
        <router-link :to="goUrl" class="history-link">
            <div class="history">
                <img :src="data.foodImageUrl" alt="">
                <div>
                    <h5>{{data.title}}</h5>
                    <p>{{data.price}}</p>
                    <p>{{data.shopName}}</p>
                </div>
            </div>
        </router-link>
    </div>
</template>

<style scoped lang='less'>
.history-link {
    text-decoration-line: none;
    color: #000;
}

.history-container {
    width: 100%;
    height: auto;
    background-color: #fff;

    // padding-left: 20rem;
    h4 {
        font-size: 20rem;
        font-style: italic;
        margin: 10rem 0;
    }

    .history {

        display: flex;
        align-items: center;

        img {
            width: 200rem;
            height: 150rem;
        }

        div {
            flex: 1;
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 150rem;
            padding-left: 10rem;

            h5 {
                flex: 1;
            }

            p {
                flex: 1;
                font-size: 15rem;
            }
        }
    }
}
</style>