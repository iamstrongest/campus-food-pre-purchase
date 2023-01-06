<script setup lang="ts">
import { findPassword } from "@/utils/axios/api/user/index.js";
import { useKey } from "@/hooks/useKey"
const info = {
    id: "",
    evidence: "",
    password: "",
};
const flag = ref(false);
const findPwd = async (e) => {
    e.preventDefault();
    if (info.id.length == 0) {
        ElMessage({
            message: "账号不能为空",
            type: "warning",
        });
        return;
    } else if (info.evidence.length == 0) {
        ElMessage({
            message: "凭证不能为空",
            type: "warning",
        });
        return;
    }
    const { data: res } = await findPassword(
        "find/password", ...useKey(info.id, info.evidence)
        // encrypt(info.id, key),
        // encrypt(info.evidence, key),
    );
    switch (res.message) {
        case "账号不存在":
            ElMessage({
                message: "账号不存在",
                type: "warning",
            });
            break;
        case "凭证错误":
            ElMessage({
                message: "凭证错误",
                type: "warning",
            });
            break;
        default:
            info.password = res.message;
            flag.value = true;
    }
};
</script>

<template>
    <div class="find-container">
        <form @submit="findPwd">
            <p>
                <label for="">请输入您的学生号:<input v-model="info.id" type="text" placeholder="请输入您的学生号" /></label>
            </p>
            <p>
                <label for="">凭证修改或找回密码:<input v-model="info.evidence" type="password" placeholder="请输入您的凭证" /></label>
            </p>
            <button>确认找回</button>
        </form>
    </div>

    <teleport to="body" v-if="flag">
        <div class="mask">
            <div class="alert-box">
                <p>你的密码是:{{ info.password }}</p>
                <router-link to="/" class="link">点击前往首页</router-link>
            </div>
        </div>
    </teleport>
</template>
<style lang="less" scoped>
.find-container {
    width: 500rem;
    height: 300rem;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border: 1rem solid #ccc;
    text-align: center;

    form {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;

        p {
            font-size: 25rem;

            input {
                height: 100%;
                font-size: 20rem;
            }
        }

        button {
            width: 200rem;
            font-size: 25rem;
            background-color: skyblue;
            color: #fff;
        }
    }
}

.mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 2;
    background-color: rgba(0, 0, 0, 0.7);

    .alert-box {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 800rem;
        height: 300rem;
        font-size: 30rem;
        border: 1px solid #fff;
        // transform: translate(-50%, -50%);

        p {
            margin: 100rem 200rem;
            color: #fff;
        }

        .link {
            margin: 200rem;
            color: #fff;
            text-decoration: none;
        }
    }
}
</style>
