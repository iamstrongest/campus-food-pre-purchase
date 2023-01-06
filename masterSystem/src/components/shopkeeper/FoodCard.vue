<script setup>
import { foodStore } from "@/stores/shop.js"
import { useRouter } from "vue-router"

const useFoodStore = foodStore();
const props = defineProps(["data"]);
const router = useRouter();
const choose = (foodId) => {
  useFoodStore.getChooseFoodHandle(`foodlist/shopId/${useFoodStore.shopId}/foodId/${foodId}`);
  useFoodStore.isloading = true;
  // 加一个定时器，防止直接进入页面，造成数据更新不及时
  setTimeout(() => {
    router.push(`/shopkeeper/food/${foodId}`);
    useFoodStore.isloading = false;
  }, 500);
}
</script>


<template>
  <div class="card-container" @click="choose(data.foodId)">
    <img :src="data.foodImageUrl" alt="">
    <div>
      <h3>{{data.title}}</h3>
      <p>￥{{data.price}}</p>
      <p>{{data.description}}</p>
    </div>
  </div>
</template>

<style scoped lang="less">
.card-container {
  margin: 20px 0 0 20px;
  width: 400px;
  height: 200px;
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  cursor: pointer;

  img {
    width: 150px;
    height: 100px;
  }

  div {
    align-self: start;
    margin-left: 10px;
    flex: 1;

    h3 {
      height: 50px
    }

    p {
      height: auto;
    }
  }

}
</style>
