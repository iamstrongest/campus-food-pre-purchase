<script setup lang='ts'>
import { foodCartStore } from '@/stores/foodCart.js'
const cartStore = foodCartStore();
const props = defineProps(["data"]);
const add = (id) => {
    cartStore.add();
    cartStore.chooseCollection.filter((item) => {
        if (item.foodId == id) {
            item.number++;
            return;
        }
    })
}
const sub = (id) => {
    cartStore.sub();
    cartStore.chooseCollection.filter((item) => {
        if (item.foodId == id) {
            if (item.number == 1) {
                item.number = 0;
                cartStore.deleteArray(id);
                if (cartStore.chooseCollection.length == 0) {

                }
                return;
            }
            item.number--;
            return;
        }
    })
}
</script>
<template>
    <div class="food">
        <div class="img">
            <img :src="data.foodImageUrl" alt="">
        </div>
        <div class="description">
            <p>{{data.title}}</p>
            <p>{{data.price}}</p>
        </div>
        <div class="aboutNums">
            <div>
                <span class="pointer" @click="sub(data.foodId)">
                    <font-awesome-icon icon="fa-solid fa-minus" />

                </span>
            </div>
            <div>
                <span>
                    {{cartStore.resize(props.data.foodId)}}
                </span>
            </div>
            <div>
                <span class="pointer" @click="add(data.foodId)">
                    <font-awesome-icon icon="fa-solid fa-plus" />
                </span>
            </div>
        </div>

    </div>
</template>
    
<style scoped lang='less'>
.food {
    width: 100%;
    height: 200rem;
    align-items: center;
    display: flex;
    border: 1rem solid #ccc;
    margin-bottom: 20rem;

    div {
        flex: 1;
        display: flex;
    }
}

.img {
    width: 80%;
    height: 80%;
    align-self: center;

    img {
        width: 100%;
        height: 100%;
    }
}

.description {
    padding-left: 20rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align: flex-start;

    p {
        flex: 1;
        display: flex;
        align-items: center;
        font-size: 20rem;
    }

    p:nth-child(2) {
        &::before {
            content: "￥"
        }
    }
}

.aboutNums {
    font-size: 25rem;
    font-weight: bold;

    .pointer {
        cursor: pointer;
    }
}
</style>