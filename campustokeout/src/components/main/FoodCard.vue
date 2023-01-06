<script lang='ts' setup>
import { foodCartStore } from '@/stores/foodCart'
import { foodDetailsStore } from '@/stores/foodDetails'
const cartStore = foodCartStore();
const detailsStore = foodDetailsStore();
const props = defineProps(["data"]);

const add = (id, e) => {
  e.stopPropagation();
  if (!cartStore.chooseCollection.some((item) => item.foodId == id)) {
    cartStore.addArray({
      foodId: props.data.foodId,
      title: props.data.title,
      description: props.data.description,
      foodImageUrl: props.data.foodImageUrl,
      price: props.data.price,
      number: 1,
    });
  } else {
    cartStore.chooseCollection.filter((item) => {
      if (item.foodId == id) {
        item.number++;
        return;
      }
    })
  }
  cartStore.add();
}
const sub = (id, e) => {
  e.stopPropagation();
  if (cartStore.chooseCollection.filter((item) => item.foodId == id && item.number == 1).length > 0) {
    cartStore.deleteArray(id);
  }
  else {
    cartStore.chooseCollection.filter((item) => {
      if (item.foodId == id) {
        item.number--;
        return;
      }
    })
  }
  cartStore.sub();
}
</script>
<template>
  <div class='footCard-container'>
    <div class='cardLeft-container'>
      <img :src="data.foodImageUrl" alt="">
    </div>
    <div class='cardCenter-container'>
      <p>
        {{data.title}}
      </p>
      <p>{{data.description}}</p>
      <span>{{data.price}}</span>
    </div>
    <div class='cardRight-container'>
      <div>
        <span v-if="cartStore.resize(props.data.foodId)>0?cartStore.resize(props.data.foodId):0"
          @click="sub(props.data.foodId,$event)" class="pointer">
          <font-awesome-icon icon="fa-solid fa-minus" />
        </span>
      </div>
      <div>
        <span v-if="cartStore.resize(props.data.foodId)>0?cartStore.resize(props.data.foodId):0">
          {{cartStore.resize(props.data.foodId)}}
        </span>
      </div>
      <div>
        <span @click="add(props.data.foodId,$event)" class="pointer">
          <font-awesome-icon icon="fa-solid fa-plus" />
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>
.footCard-container {
  width: 43%;
  height: 300rem;
  padding: 20rem;
  display: flex;
  border: 3rem solid #d8e0e9;
  margin: 20rem;

  div {
    display: flex;
    align-items: center;
  }

  .cardLeft-container {
    flex: 2;

    img {
      width: 100%;
      height: 80%;
    }
  }

  .cardCenter-container {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding-left: 20rem;

    span::before {
      content: '￥',
    }
  }

  .cardRight-container {
    flex: 1;
    display: flex;
    padding-left: 50rem;
    align-self: flex-end;
    position: relative;
    bottom: 40rem;

    div {
      flex: 1;
    }
  }
}

.pointer {
  cursor: pointer;
}
</style>