<script lang='ts' setup>
import { localstroageUser } from '@/stores/user/localstroage.js'
import { changePassword } from '@/utils/axios/api/user'
const localUserStore = localstroageUser();
const pwd = ref();
const rePwd = ref();
const key = ref();
const prompt = async (e) => {
    e.preventDefault();
    if (pwd.value == rePwd.value && pwd.value.length > 0 && rePwd.value.length > 0 && key.value.length > 0) {
        const { data: res } = await changePassword(`users/${localUserStore.loginId}/update/password`, pwd.value, key.value);
        alert(res.message);
    } else if (pwd.value.length == 0) {
        alert("请输入你想要的密码");
    } else if (rePwd.value.length == 0) {
        alert("请输入确认密码");
    } else if (key.value.length == 0) {
        alert("请输入凭证");
    } else {
        alert("确认密码错误");
    }

}
</script>
<template>
    <div>

        <h1>更改个人密码</h1>
        <form @submit="prompt">
            <p>
                <label><i>修改密码:</i> <input type="password" name="" id="" v-model="pwd" /></label>
            </p>
            <p>
                <label><i>确认密码:</i> <input type="password" name="" id="" v-model="rePwd" /></label>
            </p>
            <p>
                <label><i>输入凭证:</i> <input type="password" name="" id="" v-model="key" /></label>
            </p>
            <button>确认修改密码</button>
        </form>
    </div>
</template>

<style scoped lang='less'>
div {
    display: flex;
    flex-direction: column;
    align-items: center;

    h1 {
        text-align: center;
        margin-bottom: 30rem;
    }

    form {
        text-align: center;

        p {
            width: 400rem;
            margin-bottom: 30rem;

            input {
                height: 30rem;
            }
        }

        button {
            background-color: skyblue;
            color: white;
            width: 150rem;
            font-size: 20rem;
            height: 30rem;
            padding: 1rem;
        }
    }
}
</style>