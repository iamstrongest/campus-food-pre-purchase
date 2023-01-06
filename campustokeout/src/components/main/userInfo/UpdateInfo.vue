<script lang='ts' setup>
import { localstroageUser } from '@/stores/user/localstroage.js'
import { changeInfo, getUserInfo } from '@/utils/axios/api/user'
const localUserStore = localstroageUser();
const ipt = ref();
const txt = ref();
const prompt = async (e) => {
    e.preventDefault();
    console.log(ipt.value);
    txt.value ? txt.value : txt.value = localUserStore.userInfo.reduction;
    const { data: res } = await changeInfo(`users/${localUserStore.loginId}/update/personal`, ipt.value, txt.value);
    const { data: response } = await getUserInfo(`users/${localUserStore.loginId}`);
    localUserStore.userInfo = response;
    ipt.value = '';
    txt.value = '';
    ElMessage({
        message: res.message,
        type: "warning",
    });
}
</script>
<template>
    <div class="info-container">
        <h1>更改个人信息</h1>
        <form @submit="prompt">
            <p><label>昵称:<input type="text" name="" id="" v-model="ipt" placeholder="请输入您想要更改的昵称"> </label></p>
            <p><label><i>个人简介:</i></label></p>
            <p><textarea v-model="txt"></textarea></p>
            <button>提交</button>
        </form>
    </div>
</template>

<style scoped lang='less'>
.info-container {
    width: 100%;
    height: auto;
    text-align: center;

    h1 {
        margin: 20rem 0;
    }

    p {
        font-size: 20rem;

        input {
            width: 200rem;
            font-size: 20rem;
            padding: 1rem;
            height: 30rem;
            outline: none;
        }

        textarea {
            width: 400rem;
            height: 300rem;
            outline: none;
            resize: none;
            font-size: 20rem;
        }
    }

    button {
        background-color: skyblue;
        width: 200rem;
        height: 40rem;
        font-size: 30rem;
        color: #fff;
    }
}
</style>