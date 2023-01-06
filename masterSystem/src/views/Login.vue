
<script  setup>
import { reactive } from "vue"
import { RouterLink, useRouter } from "vue-router"
import { foodStore } from "@/stores/shop.js"
import { managerStore } from "@/stores/manager.js"
const useFoodStore = foodStore();
const useManagerStore = managerStore();
const router = useRouter();
const user = reactive({
    id: '',
    password: '',
    status: '请选择您的身份',
})
const commit = async (e) => {
    e.preventDefault();
    if (user.status !== "请选择您的身份") {
        if (user.status == "商家") {
            await useFoodStore.getshopIdHandle("shopkeeper/login", user.id, user.password);
            useFoodStore.shopkeeperLogin=true;
            router.push("/shopkeeper");
        } else {
            const message = await useManagerStore.getShopkeeperListHandle("manager/login", user.id, user.password);
            message == "登录成功" ? router.push("/manager") : alert(message);
            useManagerStore.managerLogin = true;
        };
    } else {
        alert("请选择您的身份!");
    }


}
</script>
<template>

    <div class="login-container">
        <form @submit="commit">
            <tr><label for="">账号:<input type="text" v-model="user.id" placeholder="请输入账号"></label></tr>
            <tr><label for="">密码:<input type="password" v-model="user.password" placeholder="请输入密码"></label></tr>
            <tr><label for="">身份:<select v-model="user.status">
                        <option value="请选择您的身份" disabled>请选择您的身份</option>
                        <option value="商家">商家</option>
                        <option value="管理员">管理员</option>
                    </select></label></tr>
            <button>
                登录
            </button>
        </form>

    </div>

</template>


        
<style scoped lang='less'>
.login-container {
    width: 500px;
    height: 300px;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;

    // background: #000;
    form {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 10%;

        label {
            font-size: 20px;

            input {
                margin-left: 10px;
                width: 200px;
                height: 30px;
                font-size: 20px;
            }

            select {
                width: 300px;
                height: 40px;
                font-size: 30px;
            }
        }

        button {
            width: 200px;
            height: 40px;
            font-size: 30px;
            text-decoration: none;
            color: #fff;
            background-color: #1e89ff;
        }
    }

}
</style>