<script setup>
import { ref, reactive } from "vue"
import { foodStore } from "@/stores/shop.js"
import { useRouter } from "vue-router";
const useFoodStore = foodStore();
const router = useRouter();
console.log(router);
const img = ref();
const file = ref();
const upload = () => {
    let reads = new FileReader();
    let url = file.value.files[0];
    reads.readAsDataURL(url);
    reads.onload = function (e) {
        // imageUrl.value = this.result;
        img.value.src = this.result;
        food.foodImageUrl = this.result;
    };
}
const food = reactive({
    title: '',
    shopName: '',
    price: 0,
    kind: '',
    description: '',
    campus: '请选择校区',
    foodImageUrl: ''
})
const commit = async (e) => {
    e.preventDefault();
    await useFoodStore.addFoodHandle("add/shopkeeper/food", food);
    food.value = {
        title: '',
        shopName: '',
        price: 0,
        kind: '',
        description: '',
        campus: '请选择校区',
        foodImageUrl: ''
    }
    router.push('/shopkeeper/foodlist');
}
</script>

<template>
    <div class="item-container">

        <form @submit="commit">
            <tr><label for=""><span>食物名:</span><input type="text" v-model="food.title"></label></tr>
            <tr><label for=""><span>店铺名:</span><input type="text" v-model="food.shopName"></label></tr>
            <tr><label for=""><span>单价:</span><input type="text" v-model="food.price"></label></tr>
            <tr><label for=""><span>类型:</span><input type="text" v-model="food.kind"></label></tr>
            <tr><label for=""><span>描述:</span><input type="text" v-model="food.description"></label></tr>
            <tr><label for=""><span>校区:</span><select v-model="food.campus">
                        <option value="请选择校区" disabled>请选择校区</option>
                        <option value="青山湖校区">青山湖校区</option>
                        <option value="瑶湖校区">瑶湖校区</option>
                    </select></label></tr>
            <tr>
                <div for="" class="upload"><span>点击上传图片</span> <input ref="file" type="file" name="" id=""
                        @change="upload">
                </div>
            </tr>
            <tr class="last-tr">
                <label for="">
                    <p>图片预览区</p> <img ref="img" src="" alt="">
                </label>
            </tr>
            <button>确认添加食物</button>
        </form>

    </div>
</template>

<style scoped lang='less'>
.item-container {
    width: 800px;
    height: auto;
    margin: auto;

    // display: flex;
    form {
        width: 100%;
        padding-top: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid black;

        tr {
            height: 50px;
            margin-bottom: 10px;

            input {
                width: 300px;
                height: 30px;
                font-size: 20px;
            }

            select {
                width: 200px;
                height: 30px;
            }

            .upload {
                position: relative;
                width: 200px;
                height: 50px;
                background-color: skyblue;
                text-align: center;
                line-height: 50px;
                border: 1px solid #000;
                cursor: pointer;

                input[type=file] {
                    width: 200px;
                    height: 100%;
                    position: absolute;
                    opacity: 0;
                    left: 0;
                    z-index: 2;
                }
            }
        }

        .last-tr {
            height: 300px;
        }

        button {
            font-size: 30px;
            background-image: linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%);
            color: aliceblue;
        }
    }
}

img {
    width: 200px;
    height: 200px;
}
</style>
