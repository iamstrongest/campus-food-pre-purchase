<script lang='ts' setup>
import { localstroageUser } from "@/stores/user/localstroage"
import { foodListStore } from '@/stores/foodList.ts'
const localUserStore = localstroageUser();
const useStore = foodListStore();
const num = ref(10);
const showAll = (e) => {
  e.stopPropagation();
  num.value = 20;
  localUserStore.isLoaddingAll = false;
}
const showPart = (e) => {
  e.stopPropagation();
  num.value = 10;
  localUserStore.isLoaddingAll = true;
}
const getFont = (value, e) => {
  // e.stopPropagation();
  localUserStore.search = value;
  localUserStore.isLoaddingAll = true;
  localUserStore.isShowHistorySearch = false;
  if (localUserStore.localstroageSearch.some((item, index) => {
    if (item.trim() == localUserStore.search.trim()) {
      localUserStore.localstroageSearch.splice(index, 1);
      localUserStore.localstroageSearch.unshift(localUserStore.search.trim());
      return true;
    } else {
      return false;
    }
  })) {
    if (useStore.foodList.filter((item) => item.title.includes(localUserStore.search.trim())).length > 0) {
      useStore.searchArray = useStore.foodList.filter((item) => item.title.includes(localUserStore.search.trim()));
      console.log(useStore.searchArray);
    } else {
      useStore.searchArray = [];
    }
    return;
  } else {
    if (localUserStore.localstroageSearch.length < 20) {
      localUserStore.localstroageSearch.unshift(localUserStore.search.trim());
    } else {
      localUserStore.localstroageSearch.unshift(localUserStore.search.trim());
      localUserStore.localstroageSearch.pop();
    }
    if (useStore.foodList.filter((item) => item.title.includes(localUserStore.search.trim())).length > 0) {
      useStore.searchArray = useStore.foodList.filter((item) => item.title.includes(localUserStore.search.trim()));
    } else {
      useStore.searchArray = [];
    }
  }
}
</script>
<template>
  <div id="history-search-container">
    <div class="history-search-top">
      <span class="left">搜索历史</span>
      <span>
        <font-awesome-icon icon="fa-solid fa-trash" />清除历史记录
      </span>
    </div>
    <hr />
    <div class="history-search-middle">
      <div class="for" v-for="(item) in localUserStore.localstroageSearch.slice(0,num)" @click="getFont(item,$event)">
        <i> {{item}}</i>
      </div>
    </div>
    <div class="history-search-bottom" v-if="localUserStore.isLoaddingAll" @click="showAll">
      展开更多
      <font-awesome-icon icon="fa-solid fa-arrow-down" />
    </div>
    <div class="history-search-bottom" v-if="!localUserStore.isLoaddingAll" @click="showPart">收起
      <font-awesome-icon icon="fa-solid fa-arrow-up" />
    </div>
  </div>
</template>

<style scoped lang='less'>
#history-search-container {
  position: absolute;
  width: 400rem;
  height: auto;
  background-color: #fff;
  z-index: 10;
  left: -50rem;
  border-radius: 10rem;
  border: 1rem solid #ccc;

  .history-search-top {
    display: flex;
    justify-content: space-between;
    height: 30rem;

    span {
      color: #ccc;
      font-size: 15rem;
    }

    .left {
      font-size: 20rem;
      color: #000;
    }

  }

  hr {
    border-color: skyblue;
  }

  .history-search-middle {
    display: flex;
    flex-direction: row;
    width: 400rem;
    height: auto;
    flex-wrap: wrap;
    color: red;

    .for {

      width: 100rem;
      height: 30rem;
      font-size: 12rem;
      margin: 10rem;
      text-align: center;
      border-radius: 10rem;
      background-color: #f6f7f8;
      line-height: 30rem;
      overflow: hidden;
      text-overflow: ellipsis;

      i {
        align-self: center;
        color: #545456;
      }
    }
  }

  .history-search-bottom {
    position: relative;
    width: 200rem;
    height: 30rem;
    left: 50%;
    top: 100%;
    transform: translate(-50%, -50%);
  }
}
</style>