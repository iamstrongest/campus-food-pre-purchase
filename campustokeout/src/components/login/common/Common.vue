<script lang='ts' setup>
const router = useRouter();
</script>
<template>
    <div class='common-container'>
        <div class='common-top'>
            <span calss="">
                <router-link to="/user/find" class="link"> 忘记密码?</router-link>
            </span>
            <span>
                <router-link to="/user/registy" class="link">没有账号,立即注册</router-link>
            </span>
        </div>
        <div class='common-center'>
            <div>
                <label for="agreeUnderstanding">
                    <input type="checkbox" name="" value="" id="agreeUnderstanding">
                    我以阅读并且同意协议
                </label>
            </div>
            <div>
                <label for="agreeAutoLogin">
                    <input type="checkbox" name="" value="" id="agreeAutoLogin">
                    15天内自动登录
                </label>
            </div>
        </div>
        <div class='common-botton'>
            <button>登录</button>
        </div>
    </div>
</template>

<style scoped lang='less'>
.common-container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;
    height: 200rem;

    div {
        flex: 1;
    }

    .common-top {
        display: flex;
        justify-content: space-around;

        span {
            flex: 1;
            cursor: pointer;
        }
    }

    .common-center {
        display: flex;
        align-items: center;
        justify-content: center;

        div {
            flex: 1;
        }
    }

    .common-botton {
        display: flex;
        align-items: center;
        justify-content: center;

        button {
            font-size: 30rem;
            width: 200rem;
            padding: 5rem;
            height: 50rem;
            border-radius: 10rem;
            color: rgb(254, 254, 254);
            background-color: rgb(51, 180, 222, 0.3);
        }
    }
}

.link {
    color: #000;
    text-decoration: none;
}
</style>