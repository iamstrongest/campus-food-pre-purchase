<script lang='ts' setup>
import { localstroageUser } from '@/stores/user/localstroage.js'
const localUserStore = localstroageUser();
</script> 
<template>
    <div class="header-main">
        <img :src="localUserStore.userInfo.imageUrl" alt="" />
        <div>
            <span><i>昵称:</i>{{localUserStore.userInfo.username}}</span>
            <span><i>余额:</i>{{parseInt(localUserStore.userInfo.property)}}</span>
            <p>
                <i>个人简介:</i>
            <p>
                {{localUserStore.userInfo.reduction}}
            </p>
            </p>
        </div>
    </div>
</template>
        
<style scoped lang='less'>
.header-main {
    width: 800rem;
    display: flex;

    img {
        width: 100rem;
        height: 100rem;
    }

    div {
        margin-left: 30rem;

        span {
            width: auto;
            margin-right: 30rem;
            font-size: 20rem;
        }

        p {
            width: auto;
            font-size: 20rem;
            margin-top: 10rem;
        }
    }


}
</style>
        
        
          