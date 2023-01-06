<script lang='ts' setup>
import { localstroageUser } from '@/stores/user/localstroage.js'
import { getCollections } from '@/utils/axios/api/user'
import { addViews } from '@/utils/axios/api/user'
import { useDateNow } from "@/hooks/useDate"
import { viewFood } from '@/utils/axios/api/food/aboutFood';
import { foodDetailsStore } from '@/stores/foodDetails'
const detailsStore = foodDetailsStore();
const localUserStore = localstroageUser();
const router = useRouter();
onBeforeMount(async () => {
    const { data: res } = await getCollections("user/collect", localUserStore.userInfo.collect);
    localUserStore.collectData = res.data;
    console.log(localUserStore.collectData);

})
const goDetails = async (foodId) => {
    // 更新浏览时间
    await addViews('user/add', foodId, localUserStore.loginId, useDateNow());
}
</script>
<template>
    <div class="collect">
        <aside>
            <ul>
                <li v-for="item in 100" :key="item" class="cursor">{{ item }}</li>
            </ul>
        </aside>
        <div class="collect-right">
            <main>
                <div class="showData cursor" v-for="(item) in localUserStore.collectData" :key="item" :data="item"
                    @click="goDetails(item.foodId)">
                    <router-link :to="`/fooddetails/shopId/${item.shopId}/foodId/${item.foodId}`" class="link">
                        <img :src="item.foodImageUrl" alt="">
                        <div>
                            <h5>{{ item.title }}</h5>
                            <p>{{ item.description }}</p>
                            <p>{{ item.shopName }}</p>
                        </div>
                    </router-link>
                </div>
            </main>
            <footer>
                <p>
                    <router-link to="/user/collection" class="link">查看全部收藏</router-link>
                </p>
            </footer>
        </div>
    </div>
</template>

<style scoped lang='less'>
.collect {
    position: absolute;
    width: 550rem;
    height: 500rem;
    background-color: #fff;
    z-index: 3;
    display: flex;
    top: 0rem;
    left: -400rem;
    box-shadow: 0rem 1rem #86898f;
    border-radius: 10rem;
    margin-bottom: 10rem;
    padding-left: 10rem;

    aside {
        width: 150rem;
        height: 100%;
        overflow: auto;

        ul {

            li {
                width: 100%;
                height: 50rem;
                font-size: 20rem;
                list-style: none;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-bottom: 20rem;
            }
        }
    }

    .collect-right {
        flex: auto;
    }

    main {
        flex: 1;
        height: 90%;
        position: relative;
        margin-left: 20rem;
        overflow: auto;

        .showData {
            width: 100%;
            height: auto;
            // display: flex;
            // align-items: center;
            padding-bottom: 30rem;

            .link {
                width: 100%;
                height: auto;
                display: flex;
                align-items: center;
                text-decoration: none;
                color: black;

                img {
                    width: 150rem;
                    height: 100rem;
                }

                div {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100rem;
                    padding-left: 10rem;

                    h5 {
                        flex: 2;
                    }

                    p {
                        flex: 1;
                        font-size: 15rem;
                    }
                }
            }


        }
    }
}

.cursor {
    cursor: pointer;
}

footer {
    width: 100%;
    height: 50rem;

    p {
        width: 100%;
        background-color: #2d2d2d;
        text-align: center;

        .link {
            cursor: pointer;
            color: #fff;
            text-decoration: none;

            &:hover {
                color: red;
                text-decoration: underline;
            }
        }
    }
}
</style>