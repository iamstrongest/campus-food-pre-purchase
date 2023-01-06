<script lang='ts' setup>
import { getThumbsSum, getReplysSum } from "@/utils/axios/api/user/index.js";
import { localstroageUser } from '@/stores/user/localstroage.js';
const localUserStore = localstroageUser();
const thumbsNumber = ref();
const collectionNumber = ref();
console.log(localUserStore.userInfo);

onBeforeMount(async () => {

  const { data: res1 } = await getThumbsSum(`user/getThumbsNumber?loginId=${localUserStore.loginId}`);
  thumbsNumber.value = res1.number;
  const { data: res2 } = await getReplysSum(`user/getReplysNumber?username=${localUserStore.userInfo.username}`);
  collectionNumber.value = res2.number;
})
</script>
<template>
  <div class="message-container">
    <div class="normal">
      回复我的
      <span>{{ thumbsNumber }}</span>
    </div>
    <div class="normal">
      收到的赞
      <span>{{ collectionNumber }}</span>
    </div>
    <div class="normal">
      系统通知
      <span>0</span>
    </div>
  </div>
</template>

<style scoped lang='less'>
.message-container {
  position: absolute;
  width: 200rem;
  height: 200rem;
  background-color: #fff;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  top: 0rem;
  left: -10rem;
  box-shadow: 0rem 1rem #86898f;
  border-radius: 10rem;

  div {
    width: 200rem;
    color: #86898f;
    font-size: 20rem;
    text-align: center;
    line-height: 30rem;

    .normal {
      color: #646970;
      text-decoration: none;

      &:hover {
        color: skyblue;
        text-decoration: underline;
      }
    }

    span {
      display: inline-block;
      width: 50rem;
      margin-left: 20rem;
      border-radius: 50%;
      background-color: #f56c6c;
      font-size: 15rem;
      color: #fff;
    }
  }
}
</style>