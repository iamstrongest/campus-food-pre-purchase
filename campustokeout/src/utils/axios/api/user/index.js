import service from "../../index";
// 用户登录
export function userLogin(url, id, password) {
  return service({
    url,
    method: "post",
    data: {
      id,
      password,
    },
  });
}
// 用户注册
export function userRegisty(url, id, username, password, evidence) {
  return service({
    url,
    method: "post",
    data: {
      id,
      password,
      username,
      evidence,
    },
  });
}
// 得到用户个人信息
export function getUserInfo(url) {
  return service({
    url,
    method: "get",
  });
}
// 改变用户个人信息
export function changeInfo(url, username, reduction) {
  console.log(username, reduction);
  return service({
    url,
    method: "put",
    data: {
      username: username,
      reduction,
    },
  });
}
// 改变头像
export function changeImage(url, imageUrl) {
  return service({
    url,
    method: "put",
    data: {
      imageUrl,
    },
  });
}
// 找回密码
export function findPassword(url, id, evidence) {
  return service({
    url,
    method: "post",
    data: {
      id,
      evidence,
    },
  });
}

// 改密码
export function changePassword(url, password, evidence) {
  return service({
    url,
    method: "put",
    data: {
      password,
      evidence,
    },
  });
}
// 用户购买食物后，余额减少
export function changeProperty(url, id, amount) {
  return service({
    url,
    method: "put",
    data: {
      id,
      amount,
    },
  });
}

// 添加浏览记录
export function addViews(url, foodId, userId, viewLastTime) {
  return service({
    url,
    method: "post",
    params: {
      foodId,
    },
    data: {
      userId,
      viewLastTime,
    },
  });
}

// 得到浏览记录
export function getViews(url, foodViews, userId) {
  return service({
    url,
    method: "post",
    data: {
      foodViews,
      userId,
    },
  });
}
// 得到收藏记录
export function getCollections(url, foodCollect) {
  return service({
    url,
    method: "post",
    data: {
      foodCollect,
    },
  });
}

// 得到点赞记录
export function getLoves(url, foodLoves) {
  return service({
    url,
    method: "post",
    data: {
      foodLoves,
    },
  });
}
// 得到被点赞总数
export function getThumbsSum(url) {
  return service({
    url,
    method: "get",
  });
}
// 得到被回复总数
export function getReplysSum(url) {
  return service({
    url,
    method: "get",
  });
}
