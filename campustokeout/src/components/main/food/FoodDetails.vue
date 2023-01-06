<script lang='ts' setup>
import FoodDescription from '@/components/main/food/FoodDescription.vue'
import LeaveTalk from './message/LeaveTalk.vue'
import { foodDetail } from "@/utils/axios/api/food/aboutFood";
import { foodDetailsStore } from "@/stores/foodDetails";
import { viewFood } from '@/utils/axios/api/food/aboutFood';
const detailsStore = foodDetailsStore();
const router = useRouter();
const route = useRoute();
onBeforeMount(async () => {
  await viewFood(`foodlist/foodId/${detailsStore.choice.foodId}`, detailsStore.choice.viewNumber);
  await detailsStore.getChooseHandle(`foodlist/shopId/${detailsStore.choice.shopId}/foodId/${detailsStore.choice.foodId}`);
  const { data } = await foodDetail(
    `foodlist/shopId/${route.params.shopId}/foodId/${route.params.foodId}`
  );
  detailsStore.choice = data;
})
</script>
<template>
  <div class="details-talk-container">
    <div>
      <button class="goback" @click="router.back()">
        <font-awesome-icon icon="fa-solid fa-arrow-left" />
      </button>
    </div>
    <FoodDescription></FoodDescription>
    <LeaveTalk></LeaveTalk>
  </div>
</template>

<style scoped lang='less'>
.goback {
  font-size: 30rem;
  width: 100rem;
  height: auto;
  color: #fff;
  background-color: rgb(86, 149, 255);
}
</style>