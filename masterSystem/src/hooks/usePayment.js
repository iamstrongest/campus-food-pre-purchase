import { foodCartStore } from "@/stores/foodCart";
import { localstroageUser } from "@/stores/user/localstroage";
import { changeProperty } from "@/utils/axios/api/user/";
import { getUserInfo } from "@/utils/axios/api/user";
const useLocalstroage = localstroageUser();
const cartStore = foodCartStore();
export async function payment() {
  const { data: res } = await changeProperty(
    "users/pay",
    useLocalstroage.loginId,
    cartStore.totalPrice
  );
  const { data: response } = await getUserInfo(
    `users/${useLocalstroage.loginId}`
  );
  useLocalstroage.userInfo = response;
  cartStore.cancleShowCheckoutInterfaceHandle();
  cartStore.totalNums = 0;
  cartStore.totalPrice = 0;
  cartStore.chooseCollection = [];
  alert(res.message);
}
