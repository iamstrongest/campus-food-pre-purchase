<script lang='ts' setup>
import Common from '@/components/login/common/Common.vue'
const btnMessage = ref('点击发送验证码');
</script>
<template>
    <div class="phone-container">
        <div class="phone-top">
            <h2>欢迎使用邮箱登录</h2>
        </div>
        <form>
            <div class="phone-middle">
                <div class="give-margin-bottom">
                    <label for="" class="flex"><span>邮箱号</span> <input type="text" name="" id="" placeholder="请输入您的邮箱号">
                    </label>
                </div>

                <div>
                    <label for="" class="flex"> <span>验证码</span> <input type="text" name="" placeholder="请输入邮箱验证码"
                            id=""><span class="yanzhengma">{{btnMessage}}</span>
                    </label>
                </div>
            </div>
            <div class="phone-bottom">
                <Common></Common>
            </div>
        </form>
    </div>
</template>
    
<style scoped lang='less'>
.phone-middle {

    margin-bottom: 20rem;

    div {
        .flex {
            display: flex;
            justify-content: flex-start;

            input {
                width: 200rem;
                height: 30rem;
                margin: 0 20rem;
            }
        }
    }
}

.give-margin-bottom {
    margin-bottom: 20rem;
}

.yanzhengma {
    width: auto;
    height: auto;
    border: 1px solid #ccc;
    background-color: #fc1944;
    border-radius: 10rem;
    cursor: pointer;
    color: white;
}
</style>