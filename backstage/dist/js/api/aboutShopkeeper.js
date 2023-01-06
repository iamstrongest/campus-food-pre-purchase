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

// 查询所有商家
let getAllShopkeeper = router.get("/shopkeeper", function (req, res) {
  db.query("SELECT * FROM shopkeeper", function (err, result) {
    if (err) return console.log(err.message);
    res.send(result);
  });
});
// 商家登录

let ShopkeeperLogin = router.post("/shopkeeper/login", function (req, res) {
  db.query(
    `SELECT * FROM shopkeeper where shopkeeperId=${req.body.shopkeeperId} and password="${req.body.password}"`,
    function (err, result) {
      if (err) return console.log(err.message);
      if (result.length > 0) {
        res.send({
          message: "登录成功",
          shopId: result[0].shopId,
          shopName: result[0].shopName,
        });
      } else {
        res.send({
          message: "账号或密码不正确,登录失败",
        });
      }
    }
  );
});
// 某商家查看所有食物
let showAllFoods = router.get("/get/shopkeeper/food", function (req, res) {
  db.query(
    `SELECT * FROM food_description where shopId="${req.query.shopId}"`,
    function (err, result) {
      if (err) return console.log(err.message);
      res.send(result);
    }
  );
});
// 商家添加食物
let addFoods = router.post("/add/shopkeeper/food", function (req, res) {
  const sql =
    "insert into food_description(shopId,title,shopName,price,kind,description,campus,foodImageUrl,producedTime) values(?,?,?,?,?,?,?,?,?)";
  const {
    shopId,
    title,
    shopName,
    price,
    kind,
    description,
    campus,
    foodImageUrl,
    producedTime,
  } = req.body;
  db.query(
    sql,
    [
      shopId,
      title,
      shopName,
      price,
      kind,
      description,
      campus,
      foodImageUrl,
      producedTime,
    ],
    function (err, result) {
      if (err) return console.log(err.message);
      res.send({ message: "添加成功" });
    }
  );
});
// 商家修改食物信息
let changeFoods = router.put("/put/shopkeeper/food", function (req, res) {
  const sql = `update food_description set title="${req.body.title}",shopName="${req.body.shopName}",price=${req.body.price},kind="${req.body.kind}",description="${req.body.description}",campus="${req.body.campus}",foodImageUrl="${req.body.foodImageUrl}"  where foodId=${req.body.foodId} `;
  db.query(sql, function (err, result) {
    if (err) return console.log(err.message);
    if (result.affectedRows !== 0) {
      res.send({
        message: "更新成功",
      });
    }
  });
});
// 商家删除食物
let deleteFoods = router.delete(
  "/delete/shopkeeper/food/:foodId",
  function (req, res) {
    console.log(req.params);
    db.query(
      `delete from  food_description where foodId= ${req.params.foodId}`,
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
  getAllShopkeeper,
  ShopkeeperLogin,
  showAllFoods,
  addFoods,
  changeFoods,
  deleteFoods,
};
