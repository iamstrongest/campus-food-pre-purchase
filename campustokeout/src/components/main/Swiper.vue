<script lang='ts' setup>
const props = defineProps(["data"]);

</script>
<template>
    <div class="swiper-container">
        <img :src="data.foodImageUrl" alt="">
        <div>
            <span>{{ data.title }}</span>
            <p>{{ data.description }}</p>
            <p>{{ data.shopName }}</p>
            <span class="money">{{ data.price }}</span>
        </div>
    </div>
</template>
    
<style scoped lang='less'>
.swiper-container {
    width: 100%;
    height: 100%;
    background-color: rgb(0, 0, 0);
    display: flex;
    color: #fff;


    img {
        width: 50%;
        height: 200rem;
        margin: 25rem;
    }

    div {

        flex: 1;
        display: flex;
        flex-direction: column;
        // align-self: flex-start;

        span {
            flex: 1;
        }

        p {
            flex: 2;
        }

        .money::before {
            content: "￥";
        }
    }
}
</style>