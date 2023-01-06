<script lang='ts' setup>
import UserInfo from "../../../components/main/userInfo/UserInfo.vue";
const router = useRouter();
const goHome = () => {
    router.push('/');
}
</script> 
<template>
    <div class="common-layout">
        <el-container>
            <el-header class="z-index-header header-container ">
                <div class="goHome-container pointer" @click="goHome">
                    <font-awesome-icon icon="fa-solid fa-house" class="size" title="返回主页" />
                    <p>返回主页</p>
                </div>
                <UserInfo></UserInfo>
            </el-header>
            <el-container>
                <el-aside>
                    <div class="aside">
                        <router-link to="/user/update/personal" class="common">更改个人信息</router-link>
                        <router-link to="/user/update/image" class="common">更改个人头像</router-link>
                        <router-link to="/user/update/password" class="common">更改个人密码</router-link>
                        <router-link to="/user/collection" class="common">浏览收藏记录</router-link>
                        <router-link to="/user/views" class="common">浏览历史记录</router-link>
                        <router-link to="/user/love" class="common">浏览点赞记录</router-link>
                    </div>
                </el-aside>
                <el-container>
                    <el-main class="main-container">
                        <div>
                            <router-view></router-view>
                        </div>
                    </el-main>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>
    
<style scoped lang='less'>
.el-aside {
    height: auto;
    width: 200rem;
    border-right: 1px solid black;

    .aside {
        width: 100rem;
        height: 300rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        font-size: 15rem;
    }
}

.header-container {
    display: flex;
    align-items: center;
    border: 1rem solid #ccc;

    .goHome-container {
        margin-right: 100rem;
    }
}

.main-container {
    font-size: 20rem;
}

.el-header {
    height: 150rem;
    position: sticky;
    top: 0;
    display: flex;
    z-index: 2;
    box-shadow: 10px #000;
}

.size {
    font-size: 50rem;
}

.pointer {
    cursor: pointer;

    p {
        color: rgb(153, 162, 170);
        font-weight: bold;
        font-style: italic;
    }
}

.common {
    text-decoration-line: none;
    color: #000;

    &:hover {
        background-color: skyblue;
        color: #ccc;
        text-decoration-line: underline;
    }
}
</style>
    
    
      