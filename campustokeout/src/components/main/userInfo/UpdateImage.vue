<script lang='ts' setup>
import { localstroageUser } from '@/stores/user/localstroage.js'
import { changeImage, getUserInfo } from '@/utils/axios/api/user'
const localUserStore = localstroageUser();
const file = ref();
const img = ref();
const flag = ref(false);
const imageUrl = ref('');
const upload = () => {
    let reads = new FileReader();
    let url = file.value.files[0];
    reads.readAsDataURL(url);
    reads.onload = function (e) {
        imageUrl.value = this.result;
        img.value.src = this.result;
        flag.value = true;
        console.log(this.result);
    };
}
async function prompt() {
    if (flag.value) {
        await changeImage(`users/${localUserStore.loginId}/update/image`, imageUrl.value);
        const { data: response } = await getUserInfo(`users/${localUserStore.loginId}`);
        localUserStore.userInfo = response;
        flag.value = false;
        ElMessage({
            message: "上传成功",
            type: "success",
        });
    } else {
        ElMessage({
            message: "请先上传照片",
            type: "warning",
        });
        return;
    }
}

</script>
<template>
    <div class="image-container">
        <h1>更改个人头像</h1>
        <div class="image">
            <img ref="img" src="" title='头像展示区' />
        </div>
        <span> <i>点击此处上传头像
                <font-awesome-icon icon="fa-solid fa-upload" />
            </i> <input ref="file" type="file" @change="upload()" /></span>
        <button @click="prompt">确认上传</button>
    </div>
</template>

<style scoped lang='less'>
.image-container {
    width: 100%;
    height: auto;

    h1 {
        width: 100%;
        height: auto;
        margin-bottom: 30rem;
    }

    .image {
        width: 400rem;
        height: 400rem;

        img {
            width: 100%;
            height: 100%;
        }

        margin-bottom: 30rem;
    }


    span {
        display: inline-block;
        width: 250rem;
        border: 1px solid #ccc;
        position: relative;
        background-color: #e6eaef;

        i {
            position: absolute;
            top: 0;
            left: 0;
        }

        input {
            position: relative;
            opacity: 0;
        }

        margin-right: 30rem;
    }

    button {
        background-color: skyblue;
        color: white;
        width: 100rem;
        height: 30rem;
        font-size: 20rem;
        padding: 1rem;
    }
}
</style>