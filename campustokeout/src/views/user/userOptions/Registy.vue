<script setup lang="ts">
import { userRegisty } from "@/utils/axios/api/user/index.js"
import { useKey } from "@/hooks/useKey"
const router = useRouter();
const info = {
  id: '',
  username: '',
  password: '',
  rePassword: '',
  evidence: ''
}
const registy = async (e) => {
  e.preventDefault();
  if (info.id.length >= 6 && info.username.length > 0 && info.password.length > 5 && info.password == info.rePassword && info.evidence.length > 0) {
    const response = await userRegisty('registy', ...useKey(info.id, info.username, info.password, info.evidence));
    response.data.message == '注册成功' ? router.push({
      path: '/home',
    }) : ElMessage({
      message: response.data.message,
      type: 'warning',
    })
  } else if (info.username.length == 0) {
    ElMessage({
      message: '昵称不能为空',
      type: 'warning',
    })
  } else if (info.id.length < 6) {
    ElMessage({
      message: '您输入的学生号长度不正确！',
      type: 'warning',
    })
  } else if (info.password.length < 6) {
    ElMessage({
      message: '您输入的密码长度不符！',
      type: 'warning',
    })
  } else if (info.password != info.rePassword) {
    ElMessage({
      message: '您输入的确认密码有误,请重新输入！',
      type: 'warning',
    })
  } else if (info.evidence.length == 0) {
    ElMessage({
      message: '请输入您的凭证，凭证不能为空！',
      type: 'warning',
    })
  }

}

</script>

<template>
  <main>
    <div class="registy-container">
      <form @submit="registy">
        <p><label for="">请输入您的学生号:<input v-model="info.id" type="text" placeholder="请输入您的学生号" /></label></p>
        <p><label for="">请输入您的昵称:<input v-model="info.username" type="text" placeholder="请输入您的昵称" /></label></p>
        <p><label for="">请输入您的登录密码:<input v-model="info.password" type="password" placeholder="请输入您的登录密码"
              @click="" /></label></p>
        <p><label for="">请确认您的登录密码:<input v-model="info.rePassword" type="password" placeholder="请确认登录密码"
              @click="" /></label></p>
        <p><label for="">凭证修改或找回密码:<input v-model="info.evidence" type="password" placeholder="请记录您的凭证"
              @click="" /></label>
        </p>
        <button>确认注册并且前往首页</button>
      </form>
    </div>
  </main>
</template>
<style lang="less" scoped>
main {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 100%;
  height: 100%;
  animation: registy 10s linear infinite;
}

.registy-container {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  height: 500rem;
  width: 800rem;
  display: flex;
  border: 3px solid #000;
  border-radius: 10rem;


  form {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    p {
      font-size: 20rem;

      label {
        input {
          width: 300rem;
          height: 40rem;
          font-size: 20rem;
          padding: 3rem;
          border-radius: 10rem;
          outline: none;
          border: 1rem solid skyblue;
          margin-left: 20rem;
        }
      }
    }

    button {
      height: 50rem;
      width: 300rem;
      padding: 3rem;
      font-size: 25rem;
      background-color: skyblue;
      border-radius: 10rem;
      color: #fff;
    }
  }
}

@keyframes registy {
  0% {
    background: url(@/assets/cartoon80.jpg) no-repeat;
    background-size: 100% 100%;
  }

  33% {
    background: url(@/assets/cartoon109.jpg) no-repeat;
    background-size: 100% 100%;
  }

  67% {
    background: url(@/assets/cartoon129.jpg) no-repeat;
    background-size: 100% 100%;
  }

  100% {
    background: url(@/assets/cartoon131.jpg) no-repeat;
    background-size: 100% 100%;
  }
}
</style>