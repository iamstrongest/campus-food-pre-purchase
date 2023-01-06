<script lang='ts' setup>
const props = defineProps(["data"]);
</script>
<template>
    <div class="collect-container">
        <img :src="data.foodImageUrl" alt="">
        <div>
            <span>{{data.title}}</span>
            <p>{{data.description}}</p>
            <span class="money">{{data.price}}</span>
        </div>
    </div>
</template>
        
<style scoped lang='less'>
.collect-container {
    width: 400rem;
    height: 200rem;
    background-color: #ccc;
    display: flex;


    img {
        width: 150rem;
        height: 150rem;
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