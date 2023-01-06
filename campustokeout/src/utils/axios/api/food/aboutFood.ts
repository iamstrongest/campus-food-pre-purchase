import service from "../../index";

// 查询所有食物
export function getFoodList(url: string) {
  
  return service({
    method: "get",
    url: url,
  });
}
// 查询所有商家
export function getShopList(url: string) {
  
  return service({
    method: "get",
    url: url,
  });
}

// 查询某商家所有食物
export function getShopAllFood(url: string,shopName:string) {
  
  return service({
    method: "get",
    url: url,
    params: {
      shopName,
    }
  });
}


// 查询某商品某类食物
export function foodDetail(url: string) {
  
  return service({
    method: "get",
    url,
  });
}

// 更新某商店某类食物浏览总数
export function viewFood(url: string, viewNumber: number) {
  return service({
    method: "put",
    url,
    data: {
      viewNumber: viewNumber + 1,
    }
  });
}

// 更新某商店某类食物点赞总数
export function changeUserGiveFoodThumbs(url: string,userId:number) {
  
  return service({
    method: "put",
    url,
    data: {
      userId,
    }
  });
}

// 更新某商店某类食物收藏总数
export function changeUserCollectFoodThumbs(url: string,userId:number) {
  
  return service({
    method: "put",
    url,
    data: {
      userId,
    }
  });
}

// 查询浏览最多的食物
export function viewsMax(url: string) {

  return service({
    method: "get",
    url,
  });
}
// 查询上传最新的食物
export function uploadTimeMax(url: string) {
  
  return service({
    method: "get",
    url,
  });
}


// 查询收藏最多的食物
export function collecttionMax(url: string) {
  
  return service({
    method: "get",
    url,
  });
}
// 查询点赞最多的食物
export function giveThumbsMax(url: string) {
  
  return service({
    method: "get",
    url,
  });
}