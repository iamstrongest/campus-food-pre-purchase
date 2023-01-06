<script setup>
import { ref, reactive } from "vue"
import { RouterLink, RouterView } from "vue-router"
import { managerStore } from "@/stores/manager.js"
import { useDate } from "@/hooks/useDate.js"
const useManagerStore = managerStore();
const ipt = ref(true);
const isShowDelete = ref(false);
const isShowUpdate = ref(false);
const changeInfo = reactive({
    password: useManagerStore.oprateshopkeeper.password,
    shopName: useManagerStore.oprateshopkeeper.shopName,
    address: useManagerStore.oprateshopkeeper.shop_address,
    status: useManagerStore.oprateshopkeeper.shop_status,
    expiry: useDate(useManagerStore.oprateshopkeeper.shop_expiry),
})
const confirm = async () => {
    await useManagerStore.deleteShopkeeperHandle(`delete/shopkeeper/${useManagerStore.oprateShopkeeperId}`);
    isShowDelete.value = false;
}
const cancle = () => {
    isShowDelete.value = false;
}
const deleteAlert = (shopkeeperId) => {
    useManagerStore.oprateShopkeeperId = shopkeeperId;
    isShowDelete.value = true;
}
const updateAlert = (shopkeeperId, item) => {
    useManagerStore.oprateShopkeeperId = shopkeeperId;
    useManagerStore.oprateshopkeeper = item;
    isShowUpdate.value = true;
}
const isAdd = async () => {
    await useManagerStore.addShopkeeperHandle("add/shopkeeper");
}
const commit = async () => {
    await useManagerStore.changeShopkeeperHandle(`put/shopkeeper/shopkeeperId/${useManagerStore.oprateShopkeeperId}`, changeInfo)
    isShowUpdate.value = false;

}
const nocommit = () => {
    isShowUpdate.value = false;
}
</script>
<template>
    <div class="manager-container">
        <table>
            <thead>
                <tr>
                    <th>账号</th>
                    <th>密码</th>
                    <th>店铺号</th>
                    <th>店铺名</th>
                    <th>地址</th>
                    <th>状态</th>
                    <th>到期时间</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr class="ipt">
                    <td> </td>
                    <td><input type="text"></td>
                    <td></td>
                    <td><input type="text"></td>
                    <td><input type="text"></td>
                    <td><input type="text"> </td>
                    <td><input type="text"></td>
                    <td><span @click="isAdd">添加</span><span @click="isDelete">取消</span></td>
                </tr>
                <tr v-for="(item) in useManagerStore.shopkeeperList" :key="item">
                    <td>{{item.shopkeeperId}}</td>
                    <td>{{item.password}}</td>
                    <td>{{item.shopId}}</td>
                    <td>{{item.shopName}}</td>
                    <td>{{item.shop_address}}</td>
                    <td>{{item.shop_status}}</td>
                    <td>{{useDate(item.shop_expiry)}}</td>
                    <td><span @click="updateAlert(item.shopkeeperId,item)">修改</span><span
                            @click="deleteAlert(item.shopkeeperId)">删除</span></td>
                </tr>
            </tbody>
        </table>
    </div>

    <teleport to='body' v-if="isShowDelete">

        <div class="mask">
            <div class="confirm">
                <p>
                <h2>
                    您真的想要删除该商家吗?
                </h2>
                <h2>
                    操作不可逆!
                </h2>
                </p>
                <button @click="confirm" class="sure">确认</button>
                <button @click="cancle" class="false">取消</button>
            </div>
        </div>
    </teleport>
    <teleport to='body' v-if="isShowUpdate">

        <div class="mask">
            <div class="update">
                <p>
                    店铺名<input type="text" v-model="changeInfo.shopName">
                </p>
                <p>
                    密码<input type="text" v-model="changeInfo.password">
                </p>
                <p>
                    地址<input type="text" v-model="changeInfo.address">
                </p>
                <p>
                    状态<input type="text" v-model="changeInfo.status">
                </p>
                <p>
                    到期时间<input type="text" v-model="changeInfo.expiry" />
                </p>
                <button @click="commit" class="sure">更改</button>
                <button @click="nocommit" class="false">取消</button>
            </div>
        </div>
    </teleport>
</template>

<style scoped lang='less'>
table {
    margin: 200px auto;
    width: 1000px;
    border: 1px solid #ccc;
    border-collapse: collapse;
    /* 合并缝隙 */
}

thead {
    width: 100%;

    tr {
        width: 100%;
        display: flex;

        th {
            flex: 1;
            // width: 25%;
            height: 50px;
            line-height: 50px;
            border: 1px solid #ccc;
            color: #909399;
            font-weight: bold;
        }
    }

}

tbody {
    width: 100%;

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
}

.mask {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.3);
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;

    .confirm {
        width: 500px;
        height: 200px;
        background-color: #fff;
        text-align: center;
        border-radius: 20px;

        button {
            width: 100px;
            height: 50px;
            color: #fff;
            margin-right: 20px;
            font-size: 30px;
        }

        .sure {
            background-color: red;
        }

        .false {
            background-color: blue;
        }
    }

    .update {
        width: 500px;
        height: 500px;
        background-color: #fff;
        text-align: center;
        border-radius: 20px;

        p {
            width: 100%;
            height: 50px;
            font-size: 25px;

            input {
                margin-left: 20px;
                width: 300px;
                height: 30px;
                font-size: 20px;
            }
        }

        button {
            width: 100px;
            height: 50px;
            color: #fff;
            margin-right: 20px;
            font-size: 30px;
        }

        .sure {
            background-color: red;
        }

        .false {
            background-color: blue;
        }
    }
}
</style>