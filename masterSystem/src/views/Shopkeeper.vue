<script setup>
import { ref } from "vue"
import { RouterLink, RouterView } from "vue-router"
import { foodStore } from "@/stores/shop.js"
const useFoodStore = foodStore();
const ipt = ref("");

const qs = (values) => {
  console.log(values);
}
let timer = null;
// 防抖函数
const debouncedFun = (fun, wait) => {
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(
      () => {
        fun(ipt.value);
      }, wait
    )
  }
}
// 节流函数
const throttleFun = (fun, wait) => {
    if (!timer) {
      timer = setTimeout(() => {
        fun(ipt.value);
        timer = null;
      }, wait);
    }
}
</script>
<template>
  <div class="manager-container">
    <header>
      <span class="shopname"> {{useFoodStore.shopName}}欢迎登录</span>
      <label for=""><span>搜索</span><input type="text" v-model="ipt" placeholder="搜索食物"
          @input="throttleFun(qs,1000)"></label>
    </header>
    <div class="manager-container-center">
      <aside>
        <ul>
          <li>
            <router-link to="/shopkeeper/foodlist" class="link">查询食物</router-link>
          </li>
          <li>
            <router-link to="/shopkeeper/addFood" class="link">增加食物</router-link>
          </li>
          <li>
            <router-link to="/shopkeeper/oprateFood" class="link">删除/更改食物</router-link>
          </li>
        </ul>
      </aside>
      <main>
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<style scoped lang='less'>
.manager-container {

  // background-image: url(https://ts3.cn.mm.bing.net/th?id=OIP-C.mIpyWSHJ55OckoFOXaAm2wHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.25&pid=3.1&rm=2);
  background-size: 100% 100%;

  header {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 100px;
    font-size: 40px;
    text-align: center;
    background-image: linear-gradient(to top, #c4c5c7 0%, #dcdddf 52%, #ebebeb 100%);

    .shopname {
      background-image:
        linear-gradient(90deg,
          rgb(255, 167, 69),
          rgb(254, 134, 159),
          rgb(239, 122, 200),
          rgb(160, 131, 237),
          rgb(67, 174, 255),
          rgb(160, 131, 237),
          rgb(239, 122, 200),
          rgb(254, 134, 159),
          rgb(255, 167, 69));
      background-clip: text;
      background-size: 200%;
      -webkit-background-clip: text;
      color: transparent;
      // background-size: 100% 100%;
      animation: streamer 5s linear infinite;
    }

    @keyframes streamer {
      0% {
        background-position: 0%;
      }

      100% {
        background-position: 200%;
      }

    }

    label {
      margin-left: 400px;

      span {
        width: 100px;
        height: 40px;
        font-size: 30px;
        margin-top: 30px;
        background-clip: text;
        margin-right: 20px;
      }

      input {
        width: 400px;
        font-size: 30px;
        height: 40px;
      }

    }
  }

  ul {
    width: 200px;
    display: flex;
    flex-direction: column;
    border: 1px solid #000;
    padding: 10px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0.15) 100%), radial-gradient(at top center, rgba(255, 255, 255, 0.40) 0%, rgba(0, 0, 0, 0.40) 120%) #989898;
    background-blend-mode: multiply, multiply;

    li {
      list-style: none;
      font-size: 30px;
      width: 100%;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      // border: 1px solid #000;
      margin-bottom: 20px;

      .link {
        color: #fff;
        text-decoration: none;
      }
    }
  }

  &-center {
    width: 100%;
    display: flex;

    main {
      flex: 1;
    }
  }

}
</style>