<script lang='ts' setup>
import Common from '@/components/login/common/Common.vue'
// import { userLogin } from '@/utils/axios/api/user/index.js'
import { localstroageUser } from '@/stores/user/localstroage.js'
import { getUserInfo } from '@/utils/axios/api/user'
import { loginStore } from '@/stores/user/login'
const useLoginStore = loginStore();
const localUserStore = localstroageUser();
const router = useRouter();
const user = reactive({
    id: '',
    password: '',
})
const submit = async (e) => {
    e.preventDefault();
    const response = await useLoginStore.login('login', user);
    switch (response.message) {
        case '登录成功':
            localUserStore.loginId = response.data.id;
            localUserStore.loginHandle();
            localUserStore.closeShowLoginHandle();
            const { data: res } = await getUserInfo(`users/${localUserStore.loginId}`);
            localUserStore.userInfo = res;
            ElMessage({
                message: "登录成功",
                type: "success",
            });
            setTimeout(() => {
                router.push('/home');
            }, 1000)
            break;
        case '账号不存在': ElMessage({
            message: "账号不存在",
            type: "warning",
        });
            break;
        case '密码错误': ElMessage({
            message: "密码错误",
            type: "warning",
        });
            break;
        case '账号已冻结,请联系管理员':
            ElMessage({
                message: "账号已冻结,请联系管理员",
                type: "warning",
            });
            break;
    }
}
</script>
<template>
    <div class="schoolId-container">
        <div class="schoolId-top">
            <h2>欢迎校内师生使用学号登录</h2>
        </div>
        <form @submit="submit">
            <div class="schoolId-middle">
                <div class="give-margin-bottom">
                    <label for="">学号 <input type="text" name="" id="" v-model="user.id" placeholder="请输入您的学号"> </label>
                </div>

                <div>
                    <label for="">密码 <input type="password" name="" id="" v-model="user.password"> </label>
                </div>
            </div>
            <div class="schoolId-bottom">
                <Common></Common>
            </div>
        </form>
    </div>
</template>

<style scoped lang='less'>
.schoolId-middle {
    margin-bottom: 20rem;
}

input {
    width: 300rem;
    height: 40rem;
    font-size: 30rem;
}

.give-margin-bottom {
    margin-bottom: 20rem;
}
</style>