import service from "../../index";
// 用户登录
export function shopkeeperLogin(url, shopkeeperId, password) {
  return service({
    url,
    method: "post",
    data: {
      shopkeeperId,
      password,
    },
  });
}

// 得到点击的食物信息
export function getChooseFood(url) {
  return service({
    url,
  });
}

// 得到所有食物信息
export function foodList(url) {
  return service({
    url,
    method: "get",
  });
}
// 添加食物
export function addFood(
  url,
  shopId,
  title,
  shopName,
  price,
  kind,
  description,
  campus,
  foodImageUrl,
  producedTime
) {
  return service({
    url,
    method: "post",
    data: {
      shopId,
      title,
      shopName,
      price,
      kind,
      description,
      campus,
      foodImageUrl,
      producedTime,
      isloading:false,
    },
  });
}
//改变某食物信息
export function changeFood(
  url,
  foodId,
  title,
  shopName,
  price,
  kind,
  description,
  campus,
  foodImageUrl
) {
  return service({
    url,
    method: "put",
    data: {
      foodId,
      title,
      shopName,
      price,
      kind,
      description,
      campus,
      foodImageUrl,
    },
  });
}
// 删除某食物信息
export function deleteFood(url) {
  return service({
    url,
    method: "delete",
  });
}
