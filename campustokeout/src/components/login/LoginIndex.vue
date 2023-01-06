<script lang='ts' setup>
import QrLogin from "@/components/login/QrLogin.vue";
import Email from "@/components/login/Email.vue";
import SchoolId from "@/components/login/SchoolId.vue"
import { loginStore } from '@/stores/user/login'
import { localstroageUser } from '@/stores/user/localstroage.js'
const localUserStore = localstroageUser();
let nowComponent = shallowRef(SchoolId);

const emailLogin = (e) => {
    nowComponent.value = Email;
}
const idLogin = (e) => {
    nowComponent.value = SchoolId;
}
const isShowMask = () => {
    localUserStore.closeShowLoginHandle();
}
</script>
<template>
    <div class="Login-container">
        <div class="colse-button" @click="isShowMask">
            <font-awesome-icon icon="fa-solid fa-xmark" />
        </div>
        <div class="qr-login">
            <QrLogin></QrLogin>
        </div>
        <!-- 此处li作为二维码登录和手机/学号登录的分隔线 -->
        <li></li>
        <div class="traditional-login">
            <div class="choose-login">
                <span @click="emailLogin">邮箱登录</span><span @click="idLogin">学号登录</span>
            </div>
            <keep-alive>
                <component :is="nowComponent">
                </component>
            </keep-alive>
        </div>
    </div>
</template>
    
<style scoped lang='less'>
.Login-container {
    width: 1200rem;
    height: 600rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 20rem;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 3;
    background-color: white;

    .qr-login,
    .traditional-login {
        flex: 1;
    }

    .colse-button {
        align-self: flex-start;
        width: 30rem;
        height: 30rem;
        position: relative;
        top: 5%;
        left: 97%;
        cursor: pointer;
    }

    li {
        list-style: none;
        width: 0;
        height: 500rem;
        border: 1rem solid #ccc;
        margin: 20rem;
    }


    .traditional-login {
        border: 1rem solid #ccc;
        padding: 10rem;

        // display: flex;
        .choose-login {
            margin-bottom: 20rem;
            display: flex;
            justify-content: space-around;
            align-items: center;

            span {
                color: #ccc;
                flex: 1;
                text-align: center;

                // point:cursor;
                &:hover {
                    color: skyblue;
                    text-decoration-line: underline;
                    text-shadow: 1px 1px #ccc;
                }
            }
        }
    }

}
</style>