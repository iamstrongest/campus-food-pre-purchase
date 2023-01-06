<script setup>
import { reactive, ref, defineProps } from "vue"
import { foodStore } from "@/stores/shop.js"
const props = defineProps(["data"]);
const useFoodStore = foodStore();
const img = ref();
const file = ref();
const food = reactive({
    title: '',
    shopName: '',
    price: 0,
    kind: '',
    description: '',
    campus: '请选择校区',
    foodImageUrl: ''
})
const upload = () => {
    let reads = new FileReader();
    let url = file.value.files[0];
    reads.readAsDataURL(url);
    reads.onload = function (e) {
        img.value.src = this.result;
        food.foodImageUrl = this.result;
    };
}
const commit = async (e) => {
    e.preventDefault();
    // Object.keys(food).forEach(item => {
    //     (food[item].length == 0 || food[item] == undefined) ? food[item] = food.title = useFoodStore.chooseFood[0][item] : ""
    // })
    food.title.length == 0 ? food.title = useFoodStore.chooseFood[0].title : "";
    food.shopName.length == 0 ? food.shopName = useFoodStore.chooseFood[0].shopName : "";
    food.price.length == 0 || food.price == 0 ? food.price = useFoodStore.chooseFood[0].price : "";
    food.kind.length == 0 ? food.kind = useFoodStore.chooseFood[0].kind : "";
    food.description.length == 0 ? food.description = useFoodStore.chooseFood[0].description : "";
    food.campus == "请选择校区" ? food.campus = useFoodStore.chooseFood[0].campus : "";
    food.foodImageUrl.length == 0 ? food.foodImageUrl = useFoodStore.chooseFood[0].foodImageUrl : "";
    await useFoodStore.changeFoodHandle("put/shopkeeper/food", useFoodStore.chooseFood[0].foodId, food);
}
</script>

<template>
    <div class="item-container">
        <form @submit="commit">
            <tr>
                <h2>不填,默认为之前的信息</h2>
            </tr>
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
            <button>确认更新食物</button>
        </form>

    </div>
</template>

<style scoped lang='less'>
.item-container {
    width: 800px;
    height: auto;
    margin: auto;

    p {
        text-align: center;
    }

    // display: flex;
    form {
        padding-top: 20px;
        width: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid black;

        h2 {
            color: red;
        }

        tr {
            height: 50px;
            margin-bottom: 10px;

            input {
                width: 300px;
                height: 30px;
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

        button {
            font-size: 30px;
            background-image: linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%);
            color: aliceblue;
        }

        .last-tr {
            height: 300px;
        }
    }
}

img {
    width: 200px;
    height: 200px;
}
</style>
