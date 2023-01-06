const equalFn = (id, arg) => {
  return arg.includes(id) ? equalFn(getRandom(), arg) : id;
};
const getRandom = (start = 6, end = 12) => {
  const idLength = [];
  const rondomArray = [];
  for (let i = start; i < end; i++) {
    idLength.push(i);
  }
  //得到rondomArray待抽取下标
  let index = parseInt(Math.random() * idLength.length);
  let rondomArrayIndex = 0;
  while (rondomArrayIndex == 0) {
    rondomArrayIndex = parseInt(Math.random() * 10);
  }
  rondomArray.push(rondomArrayIndex);
  let num = idLength[index];
  while (num > 1) {
    rondomArray.push(parseInt(Math.random() * 10));
    num--;
  }
  let id = +rondomArray.join("");
  return id;
};

const getId = (arg) => {
  return equalFn(getRandom(), arg);
};
exports.getId = getId;
