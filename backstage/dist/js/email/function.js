const getRandom = (length = 4) => {
  let str = "";
  for (let index = 0; index < length; index++) {
    str += parseInt(Math.random() * 10);
  }
  return str;
};

module.exports = { getRandom };
