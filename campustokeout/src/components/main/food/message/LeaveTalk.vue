<script lang='ts' setup>
import { landlordStore } from "@/stores/user/landlordList"
import { foodDetailsStore } from "@/stores/foodDetails";
import PublishLandlord from "./PublishLandlord.vue";
import { localstroageUser } from '@/stores/user/localstroage.js'
import useMove from '@/hooks/useMove.js'
import PublishFollowers from './PublishFollowers.vue'
const localUserStore = localstroageUser();
const detailsStore = foodDetailsStore();
const useLandlordStore = landlordStore();
const route = useRoute();
//element ref
const currentPage1 = ref(1)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)
//element function
const handleCurrentChange = async (val) => {
  await useLandlordStore.getLandlordListHandle(`conments/landlord/foodId/${detailsStore.choice.foodId}/page/${val}`);
  useLandlordStore.getCurrentPage(val);
}
const publish = () => {
  localUserStore.ShowLandlordConmentHande()
  localUserStore.isLogin ? "" : ElMessage({
    message: "请先登录后再回复评论",
    type: "warning",
  })
}

const AsyncComponentLandlord = defineAsyncComponent({
  loader: () => import('./LandLord.vue'),

  // // 加载异步组件时使用的组件
  loadingComponent: () => import('@/components/asyncComp/Loading.vue'),
  // 展示加载组件前的延迟时间，默认为 200ms
  delay: 3000,

  // 加载失败后展示的组件
  errorComponent: Infinity,
  // 如果提供了一个 timeout 时间限制，并超时了
  // 也会显示这里配置的报错组件，默认值是：Infinity
  timeout: 3000
})

// async function showFrom() {
//   show.value = true;
//   await nextTick();
//   useMove("conment");
// }

onBeforeMount(async () => {
  //  已经在foodDetails文件中开启数据缓存所选中的食物，因为不缓存choice的foodId，按F5刷新页面，评论区的留言将不会展示，因为choice对象不存在foodId
  await useLandlordStore.getLandlordTotalLengthHandle(`conments/landlord/foodId/${route.params.foodId}`);
  // 渲染页面前，默认展示第一页的数据
  await useLandlordStore.getLandlordListHandle(`conments/landlord/foodId/${route.params.foodId}/page/1`);
})

onMounted(() => {
  useMove("ball");
})
</script>
<template>
  <div class="message-container">
    <Teleport to="body">
      <!-- 评论小球 -->
      <div class="ball" id="ball">
        <button @click="publish">发表个人评论</button>
      </div>
    </Teleport>
    <Teleport to="body" v-if="localUserStore.isShowLandlordConment && localUserStore.isLogin">
      <PublishLandlord url="conments/push/type/1" :data="{
        floors: useLandlordStore.landlordLastLord + 1,
        foodId: detailsStore.choice.foodId,
        username: localUserStore.userInfo.username,
        imageUrl: localUserStore.userInfo.imageUrl,
      }"></PublishLandlord>
    </Teleport>
    <Teleport to="body" v-if="localUserStore.showFollowersComents && localUserStore.isLogin">
      <PublishFollowers url="conments/push/type/2"></PublishFollowers>
    </Teleport>
    <h1 class="comments">评论区</h1>
    <AsyncComponentLandlord class="LandLord-margin" v-if="useLandlordStore.landlordList.length > 0"
      v-for="(item) in useLandlordStore.landlordList" :key="item" :data="item"></AsyncComponentLandlord>
    <div class="demo-pagination-block">
      <el-pagination v-if="useLandlordStore.totalLength" v-model:currentPage="currentPage1" :small="small"
        :disabled="disabled" :background="background" layout="prev, pager, next, jumper"
        :page-size="useLandlordStore.pageSize" :total="useLandlordStore.totalLength"
        @current-change="handleCurrentChange" />
    </div>
    <h1 v-if="useLandlordStore.landlordList.length == 0">暂时还没有评论,留下你的精彩评论吧~</h1>
  </div>
</template>
  
<style scoped lang='less'>
.message-container {
  padding-bottom: 100rem;
  padding-top: 100rem;

  .comments {
    border: 1px solid #ccc;
    font-size: 40rem;
    margin-bottom: 30rem;
    background-color: #dddfe2;
  }

  h1 {
    text-align: center;
  }
}

.ball {
  position: fixed;
  display: flex;
  right: 20rem;
  top: 500rem;
  width: 150rem;
  height: 150rem;
  border-radius: 50%;
  cursor: move;
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  align-items: center;
  justify-content: center;
  font-size: 20rem;
  z-index: 2;

  button {
    border-radius: 10rem;
    font-size: 20rem;
    background-image: linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%);
  }
}


// element style
.demo-pagination-block {
  padding-left: 40%;
}
</style>