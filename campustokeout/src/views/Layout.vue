<script lang='ts' setup>
import Header from '../components/header/Header.vue'
import Lunbotu from '../components/main/Lunbotu.vue'
import Footer from '../components/footer/Footer.vue'
import ShopCart from '../components/main/cart/ShopCart.vue'
import Payment from '@/components/main/cart/Payment.vue'
import { foodCartStore } from '@/stores/foodCart'
import { changeProperty } from "@/utils/axios/api/user/"
import { getUserInfo } from '@/utils/axios/api/user'
import { localstroageUser } from '@/stores/user/localstroage'
const useLocalstroage = localstroageUser();
const cartStore = foodCartStore();
let isShowChooseFoods = ref(false);
let close = ref(false);
let time = ref(2);
const showChooseFoods = () => {
    console.log(111);
    console.log(isShowChooseFoods.value);
    cartStore.totalNums > 0 ? isShowChooseFoods.value = true : '';
    console.log(isShowChooseFoods.value);
}
const deleteAllFoods = (e) => {
    e.stopPropagation(e);
    cartStore.deleteAll();
    cartStore.getTotal;
    close.value = true;
    function timeOut() {
        new Promise(resolve => {
            setTimeout(() => {
                time.value--;
                resolve(time.value);
            }, 1000)
        }).then((res) => {
            return new Promise(resolve => (
                setTimeout(() => {
                    time.value--;
                    resolve(time.value);
                }, 1000)
            ))
        }).then((res) => {
            isShowChooseFoods.value = !isShowChooseFoods.value;
            close.value = false;
            time.value = 2;
        })
    };
    timeOut();
}
const showInterface = () => {
    cartStore.showCheckoutInterfaceHandle();
    isShowChooseFoods.value = false;
}
const payment = async () => {
    const { data: res } = await changeProperty("users/pay", useLocalstroage.loginId, cartStore.totalPrice);
    const { data: response } = await getUserInfo(`users/${useLocalstroage.loginId}`);
    useLocalstroage.userInfo = response;
    cartStore.cancleShowCheckoutInterfaceHandle();
    cartStore.totalNums = 0;
    cartStore.totalPrice = 0;
    cartStore.chooseCollection = [];
    alert(res.message);
}

const AsyncComponentShop = defineAsyncComponent({
    loader: () => import('@/components/aside/Shop1.vue'),

    // // 加载异步组件时使用的组件
    loadingComponent: () => import('@/components/asyncComp/Loading.vue'),
    // 展示加载组件前的延迟时间，默认为 200ms
    delay: 3000,

    // 加载失败后展示的组件
    errorComponent: Infinity,
    // 如果提供了一个 timeout 时间限制，并超时了
    // 也会显示这里配置的报错组件，默认值是：Infinity
    timeout: 3000
})
</script> 
<template>
    <div ref="main" class="common-layout">
        <el-container>
            <el-header class="z-index-header">
                <Header></Header>
            </el-header>
            <el-container>
                <el-aside>
                    <AsyncComponentShop></AsyncComponentShop>
                </el-aside>
                <el-container>
                    <el-main class="main-container">
                        <Lunbotu></Lunbotu>
                        <RouterView></RouterView>
                    </el-main>
                    <el-footer>
                        <Footer @click="showChooseFoods"></Footer>
                        <Teleport v-if="isShowChooseFoods" to="body">
                            <div class="mask" @click="()=>isShowChooseFoods= false">
                                <div class="cart-container pointer" @click="(e)=>e.stopPropagation()">
                                    <button @click="()=>isShowChooseFoods= false" class="blue">
                                        关闭
                                        <font-awesome-icon icon="fa-solid fa-xmark" />
                                    </button>
                                    <button class="pointer" @click="showInterface">前往购买</button>
                                    <button class="pointer" @click="deleteAllFoods">全部清空
                                        <font-awesome-icon icon="fa-solid fa-trash" class="warn" />
                                    </button>
                                    <div v-if="close" class="autoClose">
                                        {{time}}秒后自动关闭
                                    </div>
                                    <ShopCart v-for="(item) in cartStore.chooseCollection" :key="item" :data="item">
                                    </ShopCart>
                                </div>
                            </div>
                        </Teleport>
                        <Teleport v-if="cartStore.showCheckoutInterface" to="body">
                            <div class="mask1" @click="">
                                <div class="center">
                                    <div class="buttons">
                                        <button @click="cartStore.cancleShowCheckoutInterfaceHandle()"
                                            class="blue pointer">
                                            <font-awesome-icon icon="fa-solid fa-xmark" />
                                        </button>
                                        <button class="pointer" @click="payment">确认支付
                                            <font-awesome-icon icon="fa-solid fa-check" />
                                        </button>
                                        <span>待支付{{cartStore.totalPrice}}</span>
                                    </div>
                                    <Payment v-for="(item) in cartStore.chooseCollection" :key="item" :data="item">
                                    </Payment>
                                </div>
                            </div>
                        </Teleport>
                    </el-footer>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<style scoped lang='less'>
.el-aside {
    height: auto;
    width: 200rem;
    border-right: 1px solid #ccc;
    overflow: hidden;
}

.main-container {
    font-size: 20rem;
}

.el-header {
    height: auto;
    position: sticky;
    top: 0;
    z-index: 2;
    box-shadow: 10px #000;
}

.z-index-header {
    z-index: 3;
}

.mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 3;

    .cart-container {
        width: 660rem;
        height: 550rem;
        background-color: #fff;
        position: relative;
        margin: 0 auto;
        margin-top: 100rem;
        z-index: 3;
        padding: 10rem;
        overflow: auto;

        button {
            width: 180rem;
            height: 50rem;
            font-size: 25rem;
            color: white;
            text-align: center;
        }

        button:nth-child(2) {
            background-color: #eebe77;
            margin: 0 20rem;
        }

        button:nth-child(3) {
            background-color: red;
        }

        .blue {
            background-color: #4a7bf7;
        }
    }
}

.autoClose {
    width: 200rem;
    height: 100rem;
    color: red;
    font-size: 40rem;
    font-weight: bold;
    align-self: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.pointer {
    cursor: pointer;
}

.mask1 {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 3;

    .center {
        width: 600rem;
        height: 600rem;
        position: relative;
        margin: 100rem auto;
        background-color: #fff;
        overflow: scroll;

        .buttons {
            display: flex;
            height: 50rem;

            button {
                margin: 0 30rem;
                flex: 1;
                font-size: 25rem;
                color: #fff;
            }

            button:nth-child(1) {
                background-color: #fb7299;
            }

            button:nth-child(2) {
                background-color: #00b1ef;
            }

            span {
                width: 120rem;
                height: 50rem;
                font-size: 20rem;
                line-height: 50rem;
                font-style: italic;
                background-color: #0dbc79;
                margin-right: 10rem;
                color: #fff;
                text-align: center;

                &::after {
                    content: "￥"
                }
            }
        }
    }
}
</style>


  