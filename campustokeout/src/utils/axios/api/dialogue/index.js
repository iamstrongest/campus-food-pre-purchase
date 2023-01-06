import service from "@/utils/axios/index";
export function getLandlord(url) {
  return service({
    url,
    method: "get",
  });
}

export function getLandlordLength(url) {
  return service({
    url,
    method: "get",
  });
}
export function giveLandlordThumbs(url, userId) {
  return service({
    url,
    method: "put",
    data: {
      userId,
    },
  });
}

export function getReply(url) {
  return service({
    url,
    method: "get",
  });
}
export function getReplyLength(url) {
  return service({
    url,
    method: "get",
  });
}

export function giveReplyThumbs(url, replyUserId) {
  return service({
    url,
    method: "put",
    data: {
      replyUserId,
    },
  });
}

export function publishConments(url, data) {
  return service({
    url,
    method: "post",
    data: {
      data,
    },
  });
}
