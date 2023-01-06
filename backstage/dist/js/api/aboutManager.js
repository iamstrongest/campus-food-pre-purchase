const express = require("express");

const router = express.Router();

const mysql = require("mysql");
// 连接musql数据库
const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "909832",
  port: "3306",
  // 连接数据库
  database: "food_shops",
});

// 权限管理人员和商家操作-----------------------------------------------------------------------------------------------

// 权限管理人员查询
let findAllManager = router.get("/manager/find", function (req, res) {
  db.query("SELECT * FROM manager", function (err, result) {
    if (err) return console.log(err.message);
    res.send(result);
  });
});
// 权限管理人员登录,并且展示所有商家
let ManagerLogin = router.post("/manager/login", function (req, res) {
  db.query(
    `SELECT * FROM manager where managerId=${req.body.managerId} and password=${req.body.password}`,
    function (err, result) {
      if (err) return console.log(err.message);
      res.send({
        message: result.length > 0 ? "登录成功" : "账号或密码错误",
      });
    }
  );
});
// 查询所有商家
let showAllShopkeeper = router.get("/manager/all", (req, res) => {
  db.query("SELECT * FROM shopkeeper", function (err, result) {
    if (err) return console.log(err.message);
    res.send(result);
  });
});

// 权限管理人员添加商家
let addShopkeeper = router.post("/add/shopkeeper", async function (req, res) {
  const shopId = await new Promise((resolve, reject) => {
    db.query("SELECT * FROM shopkeeper", function (err, result) {
      if (err) return console.log(err.message);
      resolve(result.length);
    });
  });
  await new Promise((resolve, reject) => {
    db.query(
      `insert into shopkeeper (shopId) values (${shopId + 1})`,
      function (err, result) {
        if (err) return console.log(err.message);
        if (result.affectedRows !== 0) {
          res.send({
            message: "添加成功",
          });
        }
      }
    );
  });
});

// 权限管理人员更新商家
let updateShopkeeper = router.put(
  "/put/shopkeeper/shopkeeperId/:shopkeeperId",
  function (req, res) {
    const { shopName, password, shop_address, shop_status, shop_expiry } =
      req.body;
    const sql = `update shopkeeper set shopName="${shopName}",password="${password}",shop_address="${shop_address}",shop_status=${shop_status},shop_expiry="${Date.now(
      shop_expiry
    )}" where shopkeeperId=${req.params.shopkeeperId}`;
    db.query(sql, function (err, result) {
      if (err) return console.log(err.message);
      if (result.affectedRows !== 0) {
        res.send({
          message: "更新成功",
        });
      }
    });
  }
);

// 权限管理人员删除商家
let deleteShopkeeper = router.delete(
  "/delete/shopkeeper/:shopkeeperId",
  function (req, res) {
    db.query(
      `delete from shopkeeper where shopkeeperId= ${req.params.shopkeeperId}`,
      function (err, result) {
        if (err) return console.log(err.message);
        if (result.affectedRows !== 0) {
          res.send({
            message: "删除成功",
          });
        }
      }
    );
  }
);
module.exports = {
  findAllManager,
  ManagerLogin,
  showAllShopkeeper,
  addShopkeeper,
  updateShopkeeper,
  deleteShopkeeper,
};
