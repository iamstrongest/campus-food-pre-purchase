<script lang='ts' setup>
import Common from "./common/Common.vue";

</script>
<template>
  <div class="qr-container">
    <div class="qr-top">
      <h4>登录官方App扫描下方二维码登录</h4>
    </div>
    <div class="qr-middle">
      <img src="@/assets/二维码.png" alt="">
    </div>
    <div class="qr-bottom">
      <div>
        <label for="agreeQrLogin">
          <input type="checkbox" name="" value="" id="agreeQrLogin">
          15天内自动登录
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>
.qr-container {
  width: 90%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  div {
    flex: 1;
  }

  .qr-top {
    width: 100%;
    font-size: 25rem;
    text-align: center;
  }

  .qr-middle {
    display: flex;
    align-items: center;

    img {
      width: 100%;
      height: 100%;

    }
  }
}
</style>