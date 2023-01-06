// 展示当前时间
export function useDate(parms) {
  if (parms == undefined) {
    const year = new Date().getFullYear();
    const month = parse(new Date().getMonth() + 1);
    const day = parse(new Date().getDate());
    const hour = parse(new Date().getHours());
    const minutes = parse(new Date().getMinutes());
    const seconds = parse(new Date().getSeconds());
    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
  } else {
    let date = new Date(parms);
    let year = date.getFullYear();
    let Month = parse(date.getMonth() + 1);
    let Day = parse(date.getDate());
    let Hours = parse(date.getHours());
    let Minutes = parse(date.getMinutes());
    let Seconds = parse(date.getSeconds());
    return `${year}-${Month}-${Day} ${Hours}:${Minutes}:${Seconds}`;
  }
}
// // 显示多余0
function parse(parmas) {
  return parmas >= 10 ? parmas : "0" + parmas;
}
export function useDateNow() {
  return Date.now();
}
