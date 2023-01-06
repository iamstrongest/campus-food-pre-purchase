<script setup lang='ts'>
import { ref, onMounted } from 'vue'
let speed = ref(1)
let bar = ref()
let timer = ref(0)
const startLoading = () => {
    let dom = bar.value;
    speed.value = 1
    timer.value = window.requestAnimationFrame(function fn() {
        if (speed.value < 90) {
            speed.value += 1;
            dom.style.width = speed.value + '%'
            timer.value = window.requestAnimationFrame(fn)
        } else {
            speed.value = 1;
            dom.style.width = " 0";
            window.cancelAnimationFrame(timer.value)
        }
    })

}

const endLoading = () => {
    let dom = bar.value;
    setTimeout(() => {
        window.requestAnimationFrame(() => {
            speed.value = 100;
            dom.style.width = speed.value + '%'
        })
    }, 500)
}
const errorLoading = () => {
    let dom = bar.value;
    dom.style.backgroundColor = "red";
}

defineExpose({
    startLoading,
    endLoading,
    errorLoading
})
</script>
<template>
    <div class="wraps">
        <div ref="bar" class="bar"></div>
    </div>
</template>
<style scoped lang="less">
.wraps {
    position: fixed;
    top: 0;
    width: 100%;
    height: 2px;
    z-index: 999;

    .bar {
        height: inherit;
        width: 0;
        background: blue;
    }
}
</style>