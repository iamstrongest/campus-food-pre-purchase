import service from "../../index";
// 管理员登录
export function managerLogin(url, managerId, password) {
  return service({
    url,
    method: "post",
    data: {
      managerId,
      password,
    },
  });
}
export function getShopkeeperList(url) {
  return service({
    url,
    method: "get",
  });
}

export function getChooseShopkeeperId(url) {
  return service({
    url,
    method: "post",
    method: "get",
  });
}
export function deleteShopkeeper(url) {
  return service({
    url,
    method: "delete",
  });
}
export function addShopkeeper(url) {
  return service({
    url,
    method: "post",
    data: {},
  });
}
export function changeShopkeeper(url, info) {
  const data = {
    shopName: info.shopName,
    shop_address: info.address,
    password: info.password,
    shop_status: info.status,
    shop_expiry: info.expiry,
  };
  return service({
    url,
    method: "put",
    data,
  });
}
