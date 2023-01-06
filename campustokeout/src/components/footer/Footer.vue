<script lang='ts' setup>
import { foodCartStore } from '@/stores/foodCart'
import { localstroageUser } from '@/stores/user/localstroage'
const useLocalstroage = localstroageUser();
const cartStore = foodCartStore();
const showInterface = (e) => {
    e.stopPropagation();
    cartStore.showCheckoutInterfaceHandle();
}
</script>
<template>
    <div class='footer-container'>
        <el-icon>
            <ShoppingCart />
        </el-icon>
        <div class='totalMoney'>
            <div class="totalNum">
                <el-icon>
                    <Food />
                </el-icon>
                <span class='food'> 购买数量{{cartStore.totalNums}}件</span>
            </div>
            <span class='right'>待支付{{cartStore.getTotal}}元</span>
        </div>
        <div>
            <button v-if="cartStore.totalNums&&useLocalstroage.isLogin" @click="showInterface">去支付</button>
            <button v-else disabled @click="(e)=>e.stopPropagation()">未购买</button>
        </div>
    </div>
</template>

<style scoped lang='less'>
.footer-container {
    width: 100%;
    height: 100rem;
    display: flex;
    background-color: transparent;
    position: fixed;
    bottom: 0;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.3);
    color: white;

    .el-icon {
        flex: 1;
        font-size: 80rem;
        padding: 5rem;
    }

    div {
        flex: 1;
        display: flex;
        justify-content: start;
        align-items: center;

        button {
            width: 200rem;
            height: 50rem;
            border-radius: 10rem;
            color: rgb(242, 242, 242);
            font-size: 30rem;
            background-color: #000;
        }

        .red {
            background-color: red;
        }
    }

    .totalMoney {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .right {
            position: relative;
            justify-self: center;
            font-size: 30rem;
            color: white;

            &::before {
                position: absolute;
                left: -30rem;
                content: "￥";
                color: white;
            }
        }

        .totalNum {
            align-self: center;
            height: 40rem;

            .el-icon {
                font-size: 30rem;
            }

            .food {
                position: relative;
                justify-self: center;
                color: white;
                font-size: 30rem;

            }
        }

    }
}

.mask {
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
                margin: 0 50rem;
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
        }
    }
}
</style>