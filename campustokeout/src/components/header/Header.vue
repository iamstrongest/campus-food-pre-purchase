<script lang="ts" setup>
import { ref } from "vue";
import LoginIndex from "../login/LoginIndex.vue";
import { loginStore } from '@/stores/user/login'
import { foodListStore } from '@/stores/foodList.ts'
import { localstroageUser } from '@/stores/user/localstroage.js'
import SearchHistory from './input/SearchHistory.vue'
// import { throttle } from 'lodash'
// 所有的store
const useStore = foodListStore();
const store = loginStore();
const localUserStore = localstroageUser();
// 所有的ref

const selected = ref("请选择校区");
const isShowPerson = ref(false);
const isShowMessage = ref(false);
const isShowPosses = ref(false);
const isShowHistory = ref(false);

//所有的功能 
const getvalue = (e) => {

};

const login = () => {
    localUserStore.ShowLoginHandle();
}
const clickInput = (e) => {
    e.stopPropagation();
}
let timer = null;
const throttleFun = (wait = 2000) => {
    if (!timer) {
        timer = setTimeout(() => {
            if (useStore.foodList.filter((item) => item.title.includes(localUserStore.search.trim())).length > 0) {
                useStore.searchArray = useStore.foodList.filter((item) => item.title.includes(localUserStore.search.trim()));
            } else {
                useStore.searchArray = [];
            }
            timer = null;
        }, wait);
    }

}
const confirm = (e) => {
    localUserStore.isLoaddingAll = true;
    if (localUserStore.localstroageSearch.some((item, index) => {
        if (item.trim() == localUserStore.search.trim()) {
            localUserStore.localstroageSearch.splice(index, 1);
            localUserStore.localstroageSearch.unshift(localUserStore.search.trim());
            return true;
        } else {
            return false;
        }
    })) {
        return;
    } else {
        if (localUserStore.localstroageSearch.length < 20) {
            localUserStore.localstroageSearch.unshift(localUserStore.search.trim());
        } else {
            localUserStore.localstroageSearch.unshift(localUserStore.search.trim());
            localUserStore.localstroageSearch.pop();
        }
    }
    if (useStore.foodList.filter((item) => item.title.includes(localUserStore.search.trim())).length > 0) {
        useStore.searchArray = useStore.foodList.filter((item) => item.title.includes(localUserStore.search.trim()));
    } else {
        useStore.searchArray = [];
    }
}
const focus = (e) => {

    localUserStore.isShowHistorySearch = true;
}

const showPerson = () => {
    isShowPerson.value = true;
}
const canleShowPerson = () => {
    isShowPerson.value = false;
}

const showMessage = () => {
    isShowMessage.value = true;
}
const canleShowMessage = () => {
    isShowMessage.value = false;
}

const showPossess = () => {
    isShowPosses.value = true;
}
const canleShowPossess = () => {
    isShowPosses.value = false;
}

const showHistory = () => {
    isShowHistory.value = true;
}
const canleShowHistory = () => {
    isShowHistory.value = false;
}
document.querySelector("body").addEventListener('click', function (e) {
    localUserStore.isShowHistorySearch = false;
});
// 异步组件
const AsyncComponentMessageHover = defineAsyncComponent({
    loader: () => import('./right/MessageHover.vue'),
    loadingComponent: () => import('@/components/asyncComp/Loading.vue'),
    delay: 3000,
    errorComponent: Infinity,
    timeout: 3000
})
const AsyncComponentCollectionHover = defineAsyncComponent({
    loader: () => import('./right/CollectionHover.vue'),
    loadingComponent: () => import('@/components/asyncComp/Loading.vue'),
    delay: 3000,
    errorComponent: Infinity,
    timeout: 3000
})
const AsyncComponentViewHover = defineAsyncComponent({
    loader: () => import('./right/ViewHover.vue'),
    loadingComponent: () => import('@/components/asyncComp/Loading.vue'),
    delay: 3000,
    errorComponent: Infinity,
    timeout: 3000
})
</script>
<template>
    <div class="header-container">
        <div class="header-left">
            <img src="@/assets/师大logo.jpeg" alt="" title="欢迎来到江西师范大学点菜食堂" />
            <label for="">校区选择:<select class="font" v-model="selected" @change="getvalue">
                    <option disabled>请选择校区</option>
                    <option>青山湖校区</option>
                    <option>瑶湖校区</option>
                </select></label>
        </div>
        <div class="header-center">
            <div class="ipt-container">

                <label for="">搜索<el-icon>
                        <Search />
                    </el-icon> <input type="text" v-model="localUserStore.search" @keyup.enter="confirm"
                        placeholder="请输入搜索的美食" @input='throttleFun(1000)' @focus="focus" @click="clickInput" /></label>
                <SearchHistory v-if="localUserStore.isShowHistorySearch"></SearchHistory>
            </div>
        </div>
        <div class="header-right">
            <div class="login cursor" @click="login" v-if="!localUserStore.isLogin">
                <div>
                    <el-icon>
                        <User />
                    </el-icon>
                </div>
                <span> 登录</span>
            </div>
            <div v-else class="login cursor confirm-login " @mouseenter="showPerson" @mouseleave="canleShowPerson"
                @click="" title="点击查看个人中心">
                <router-link to="/user">
                    <el-avatar class="moveUp" :src="localUserStore.userInfo.imageUrl" />
                </router-link>
                <UserHover v-if="isShowPerson"></UserHover>
            </div>
            <Teleport to="body" v-if=localUserStore.isShowLogin>
                <div class="mask">
                    <LoginIndex></LoginIndex>
                </div>
            </Teleport>
            <div class="relative hover" @mouseenter="showMessage" @mouseleave="canleShowMessage">
                <div class="message ">
                    <el-icon class="moveUp">
                        <ChatDotRound />
                    </el-icon>
                </div>
                <span class="message "> 消息 </span>
                <div class="hover">
                    <AsyncComponentMessageHover v-if="isShowMessage&&localUserStore.isLogin">
                    </AsyncComponentMessageHover>
                </div>
            </div>
            <div class="possess hover" @mouseenter="showPossess" @mouseleave="canleShowPossess" title="点击查看收藏中心">
                <div class="cursor">
                    <router-link to="/user/collection" class="blank">
                        <el-icon class="moveUp">
                            <DocumentAdd />
                        </el-icon>
                    </router-link>
                </div>
                <router-link to="/user/collection" class="blank">
                    <span class="cursor"> 收藏 </span>
                </router-link>

                <div class="hover" title="关于用户之外的信息">
                    <AsyncComponentCollectionHover v-if="isShowPosses&&localUserStore.isLogin">
                    </AsyncComponentCollectionHover>
                </div>
            </div>
            <div class="history hover" @mouseenter="showHistory" @mouseleave="canleShowHistory" title="点击查看历史中心">
                <div class="cursor">
                    <router-link to="/user/views" class="blank">
                        <el-icon class="moveUp">
                            <PieChart />
                        </el-icon>
                    </router-link>

                </div>
                <router-link to="/user/views" class="blank">
                    <span class="cursor"> 历史 </span>
                </router-link>

                <div class="hover">
                    <AsyncComponentViewHover v-if="isShowHistory&&localUserStore.isLogin"></AsyncComponentViewHover>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
.header-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 25rem;
    box-shadow: 5px 5px rgba(98, 148, 168, 0.1);


    .header-left {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;

        img {
            width: 130rem;
            height: 100rem;
        }

        select {
            position: relative;
            top: 0rem;
            width: 150rem;
            height: 30rem;
            color: 25rem;
            border-radius: 10rem;
        }
    }

    .header-right {
        flex: 1;
        display: flex;
        justify-content: space-around;
        align-items: center;

        .message,
        .login,
        .possess,
        .history {
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;
        }
    }

    .confirm-login {
        position: relative;
    }

    .header-center {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        div {
            width: auto;
            height: auto;

            label {
                position: relative;

                .el-icon {
                    position: absolute;
                    right: 0px;
                    top: 10rem;
                    color: skyblue;
                }
            }

            input {
                font-size: 20rem;
                padding: 10rem;
                border-radius: 10rem;
                outline: none;
                border-color: skyblue;
            }
        }
    }
}

.mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 2;
}

.cursor {
    cursor: pointer;
}

.ipt-container {
    position: relative;
}

.hover {
    position: relative;

    &:hover {

        // transform: translate(0, 10rem);
        div {
            .moveUp {
                animation: movePositon 2s linear;
            }
        }

    }
}

.moveUp {
    &:hover {
        animation: movePositon 2s linear;
    }

}

@keyframes movePositon {
    0% {
        transform: translate(0, -10rem);
    }

    100% {
        transform: translate(0, 0rem);
    }
}

.blank {
    color: #000;
    text-decoration: none;
}

.font {
    font-size: 20rem;
}
</style>
