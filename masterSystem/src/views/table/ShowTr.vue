<script lang='ts' setup>
const props = defineProps(["data"]);
</script>
<template>
    <tr>
        <td>{{1}}</td>
        <td>{{2}}</td>
        <td>{{1}}</td>
        <td>{{1}}</td>
        <td>{{1}}</td>
        <td><span @click="isChange">修改</span><span @click="isDelete">删除</span></td>
    </tr>
</template>

<style scoped lang='less'>
tr {
    width: 100%;
    display: flex;
    background-color: #f5f7fa;




    input {
        border: none;
        width: 100%;
        height: 100%;
        font-size: 30px;
    }

    :nth-of-type(even) {
        background-color: #ffffff;
    }

    :nth-of-type(odd) {
        background-color: #f5f7fa;
    }

    :hover {
        background-color: #409eff;
    }

    td {
        flex: 1;
        height: 50px;
        border: 1px solid #ccc;
        display: flex;
        align-items: center;
        justify-content: space-around;

        span {
            width: 60px;
            height: 30px;
            cursor: pointer;
            border-radius: 5px;
            text-align: center;
            color: #fff;
            line-height: 30px;

            &:nth-of-type(1) {
                background-color: #f56c6c;
            }

            &:nth-of-type(2) {
                background-color: #67c23a;
            }
        }
    }
}
</style>