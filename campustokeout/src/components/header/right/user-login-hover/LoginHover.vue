<script lang='ts' setup>
import { localstroageUser } from '@/stores/user/localstroage'
const useLocalstroage = localstroageUser();
const logOut = () => {
    useLocalstroage.isLogin = false;
    useLocalstroage.loginId = '';
    useLocalstroage.collectData = [];
    useLocalstroage.collectData = [];
    useLocalstroage.userInfo = {};
}
</script>
<template>
    <div class="user-hover-container">
        <div>
            <router-link to="/user" class="normal">更多信息</router-link>
        </div>
        <div class="normal pointer" @click="logOut">

            退出登录
        </div>
    </div>
</template>
<style scoped lang="less">
.user-hover-container {
    position: absolute;
    width: 100rem;
    height: 100rem;
    background-color: #fff;
    z-index: 2;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    top: 50rem;
    left: 0rem;
    box-shadow: 0rem 1rem #86898f;
    border-radius: 10rem;

    div {
        width: 200rem;
        color: #86898f;
        font-size: 20rem;
        text-align: center;
        line-height: 30rem;

        .normal {
            color: #646970;
            text-decoration: none;

            &:hover {
                color: skyblue;
                text-decoration: underline;
            }
        }
    }

    .pointer {
        cursor: pointer;

        &:hover {
            text-decoration-line: underline;
            color: skyblue;
        }
    }
}
</style>