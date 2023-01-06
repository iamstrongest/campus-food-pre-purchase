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
// 食物操作-----------------------------------------------------------------------------------------------
// 查询浏览最多的食物
let findMostViews = router.get("/view/foodlist", function (req, res) {
  db.query("SELECT * FROM food_description", function (err, result) {
    if (err) return console.log(err.message);
    let data = result
      .sort((item1, item2) => item2.viewNumber - item1.viewNumber)
      .slice(0, req.query.showNumber);
    res.send({
      data,
    });
  });
});

// 查询上传最新的食物
let uploadNewFoods = router.get("/upload/foodlist", function (req, res) {
  db.query("SELECT * FROM food_description", function (err, result) {
    if (err) return console.log(err.message);
    let data = result
      .sort((item1, item2) => item2.producedTime - item1.producedTime)
      .slice(0, req.query.showNumber);
    res.send({
      data,
    });
  });
});

// 查询收藏最多的食物
let collectMostViews = router.get(
  "/collect/foodlist",
  async function (req, res) {
    let data,
      list,
      array,
      sendData = [];
    array = await new Promise(async (resolve, reject) => {
      db.query("SELECT * FROM give_food_collection", function (err, result) {
        if (err) return console.log(err.message);
        data = result.map((item) => item.foodId);
        list = [...new Set(data)];
        array = [];

        list.forEach((item, index) => {
          array.push({
            foodId: item,
            collectionsNumber: data.filter((num) => num == item).length,
          });
        });
        array = array
          .sort(
            (item1, item2) => item2.collectionsNumber - item1.collectionsNumber
          )
          .slice(0, req.query.showNumber);
        resolve(array);
      });
    });
    await new Promise(async (resolve, reject) => {
      array.forEach((item, index) => {
        db.query(
          `SELECT * FROM food_description where foodId=${item.foodId}`,
          function (err, result) {
            if (err) return console.log(err.message);
            sendData.push(result[0]);
            console.log(sendData);
            if (index == array.length - 1) {
              res.send({
                data: sendData,
              });
            }
          }
        );
      });
    });
  }
);

// 查询点赞最多的食物
let giveThumbsMostViews = router.get(
  "/giveThumbs/foodlist",
  async function (req, res) {
    let data,
      list,
      array,
      sendData = [];
    array = await new Promise(async (resolve, reject) => {
      db.query("SELECT * FROM give_food_thumbs", function (err, result) {
        if (err) return console.log(err.message);
        data = result.map((item) => item.foodId);
        list = [...new Set(data)];
        array = [];

        list.forEach((item, index) => {
          array.push({
            foodId: item,
            gvieThumbsNumber: data.filter((num) => num == item).length,
          });
        });
        array = array
          .sort(
            (item1, item2) => item2.gvieThumbsNumber - item1.gvieThumbsNumber
          )
          .slice(0, req.query.showNumber);
        resolve(array);
      });
    });
    await new Promise(async (resolve, reject) => {
      array.forEach((item, index) => {
        db.query(
          `SELECT * FROM food_description where foodId=${item.foodId}`,
          function (err, result) {
            if (err) return console.log(err.message);
            sendData.push(result[0]);
            if (index == array.length - 1) {
              console.log(sendData);
              res.send({
                data: sendData,
              });
            }
          }
        );
      });
    });
  }
);

// 查看某用户浏览过的食物
let userViewsFoods = router.post("/user/views", async function (req, res) {
  const views = [];
  let viewLastTime = 0;
  const foodViews = req.body.foodViews;
  for await (foodId of foodViews) {
    await new Promise((resolve, reject) => {
      db.query(
        `SELECT viewLastTime FROM views where foodId=${foodId} and userId=${req.body.userId}`,
        function (err, result) {
          if (err) return console.log(err.message);
          viewLastTime = result[0].viewLastTime;
        }
      );
      db.query(
        `SELECT * FROM food_description where foodId=${foodId}`,
        function (err, result) {
          if (err) return console.log(err.message);
          result[0].viewLastTime = viewLastTime;
          views.push(result[0]);
          resolve();
        }
      );
    });
  }
  res.send({
    data: views.sort((a, b) => b.viewLastTime - a.viewLastTime),
  });
});

// 查看某用户收藏的食物
let findCollectFoods = router.post("/user/collect", async function (req, res) {
  const collections = [];
  const foodCollect = req.body.foodCollect;
  for await (foodId of foodCollect) {
    await new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM food_description where foodId=${foodId}`,
        function (err, result) {
          if (err) return console.log(err.message);
          collections.push(result[0]);
          resolve();
        }
      );
    });
  }
  res.send({
    data: collections,
  });
});
// 查看某用户点赞过的食物
let findGiveThumbsFoods = router.post("/user/love", async function (req, res) {
  const loves = [];
  const foodLoves = req.body.foodLoves;
  for await (foodId of foodLoves) {
    await new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM food_description where foodId=${foodId}`,
        function (err, result) {
          if (err) return console.log(err.message);
          loves.push(result[0]);
          resolve();
        }
      );
    });
  }
  res.send({
    data: loves,
  });
});

// 查询所有食物
let findAllFoods = router.get("/foodlist", function (req, res) {
  db.query("SELECT * FROM food_description", function (err, result) {
    if (err) return console.log(err.message);
    res.send({
      data: result,
    });
  });
});

// 查询某家店的所有食物
let findShopAllFoods = router.get(
  "/foodlist/shopId/:shopId",
  function (req, res) {
    db.query(
      `SELECT * FROM food_description where shopId=${req.params.shopId}`,
      function (err, result) {
        if (err) return console.log(err.message);
        res.send(result);
      }
    );
  }
);

// 查询所有商家
let findAllShops = router.get("/foodlist/shopName", function (req, res) {
  db.query(`SELECT shopName FROM food_description`, function (err, result) {
    if (err) return console.log(err.message);
    let array = [];
    result.forEach((item) => {
      array.push(item.shopName);
    });
    array = [...new Set(array)];
    res.send({
      data: array,
    });
  });
});

// 查询某商家的所有食物,以及食物分类
let findShopAllTypeFoods = router.get(
  "/foodlist/shop",
  async function (req, res) {
    let data = [];
    let kind = [];
    data = await new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM food_description where shopName="${req.query.shopName}"`,
        function (err, result) {
          if (err) return console.log(err.message);
          resolve(result);
        }
      );
    });
    kind = await new Promise((resolve, reject) => {
      db.query(
        `SELECT kind FROM food_description where shopName="${req.query.shopName}"`,
        function (err, result) {
          if (err) return console.log(err.message);
          result.forEach((item) => {
            kind.push(item.kind);
          });
          kind = [...new Set(kind)];
          resolve(kind);
        }
      );
    });
    res.send({
      data,
      kind,
    });
  }
);

// 查询某商店的某类食物
let findShopypeAllFoods = router.get(
  "/foodlist/shopId/:shopId/kind/",
  function (req, res) {
    db.query(
      `SELECT * FROM food_description where knid="${req.query.kind}"`,
      function (err, result) {
        if (err) return console.log(err.message);
        res.send(result);
      }
    );
  }
);

// 查询某商店的某样食物详细信息，shopId是商店主码，foodId是食物的主码
let findShopFoodsDetails = router.get(
  "/foodlist/shopId/:shopId/foodId/:foodId",
  async function (req, res) {
    const foodDetails = {
      foodId: 0,
      price: 0,
      description: "",
      title: "",
      shopName: "",
      giveUserThumbs: [],
      giveUserThumbsNumber: 0,
      giveUserCollection: [],
      giveUserCollectionNumber: 0,
      viewNumber: 0,
      shopId: 0,
      kind: "",
      foodImageUrl: "",
    };
    await new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM food_description where foodId=${req.params.foodId} and shopId=${req.params.shopId}`,
        function (err, result) {
          if (err) return console.log(err.message);
          foodDetails.foodId = result[0].foodId;
          foodDetails.price = result[0].price;
          foodDetails.description = result[0].description;
          foodDetails.title = result[0].title;
          foodDetails.shopName = result[0].shopName;
          // foodDetails.type = result[0].type;
          foodDetails.viewNumber = result[0].viewNumber;
          foodDetails.shopId = result[0].shopId;
          foodDetails.kind = result[0].kind;
          foodDetails.foodImageUrl = result[0].foodImageUrl;
          resolve(foodDetails);
        }
      );
    });
    await new Promise((resolve, reject) => {
      db.query(
        `SELECT userId FROM give_food_collection where foodId=${req.params.foodId}`,
        function (err, result) {
          if (err) return console.log(err.message);
          foodDetails.giveUserCollectionNumber = result.length;
          foodDetails.giveUserCollection = result.map((item) => item.userId);
          resolve(foodDetails);
        }
      );
    });
    await new Promise((resolve, reject) => {
      db.query(
        `SELECT userId FROM give_food_thumbs where foodId=${req.params.foodId}`,
        function (err, result) {
          if (err) return console.log(err.message);
          foodDetails.giveUserThumbsNumber = result.length;
          foodDetails.giveUserThumbs = result.map((item) => item.userId);
          resolve(foodDetails);
        }
      );
    });
    await new Promise((resolve, reject) => {
      res.send(foodDetails);
      resolve("ok");
    });
  }
);
// 食物的浏览数增加
let addViewFoods = router.put("/foodlist/foodId/:foodId", function (req, res) {
  db.query(
    `update food_description set viewNumber=${req.body.viewNumber} where foodId=${req.params.foodId}`,
    function (err, result) {
      if (err) return console.log(err.message);
      if (result.affectedRows !== 0) {
        res.send({
          message: "浏览加1成功",
        });
      }
    }
  );
});
// 商品收藏与否,foodId是商品号 根据有无userid判断是否收藏或者删除
let updateCollectFoods = router.put(
  "/foodlist/foodId/:foodId/collect/",
  function (req, res) {
    const sql1 = `SELECT * FROM give_food_collection where foodId=${req.params.foodId} and userId=${req.body.userId}`;
    db.query(sql1, function (err, result) {
      if (err) return console.log(err.message);
      if (result == 0) {
        const sql2 =
          "insert into give_food_collection (foodId,userId) VALUES(?,?);";
        db.query(
          sql2,
          [req.params.foodId, req.body.userId],
          function (err, result) {
            if (result.affectedRows !== 0) {
              res.send({
                message: "添加收藏成功",
              });
            }
          }
        );
      } else {
        const sql2 = `delete from give_food_collection where foodId=${req.params.foodId} and userId=${req.body.userId}`;
        db.query(sql2, function (err, result) {
          res.send({
            message: "取消收藏成功",
          });
        });
      }
    });
  }
);

// 商品点赞与否,foodId是商品号，根据有无userid判断是否收藏或者删除
let updateFoodsThumbs = router.put(
  "/foodlist/foodId/:foodId/giveThumbs",
  function (req, res) {
    const sql1 = `SELECT * FROM give_food_thumbs where foodId=${req.params.foodId} and userId=${req.body.userId}`;
    db.query(sql1, function (err, result) {
      if (err) return console.log(err.message);
      if (result == 0) {
        const sql2 =
          "insert into give_food_thumbs (foodId,userId) VALUES(?,?);";
        db.query(
          sql2,
          [req.params.foodId, req.body.userId],
          function (err, result) {
            if (result.affectedRows !== 0) {
              res.send({
                message: "添加点赞成功",
              });
            }
          }
        );
      } else {
        const sql2 = `delete from give_food_thumbs where foodId=${req.params.foodId} and userId=${req.body.userId}`;
        db.query(sql2, function (err, result) {
          if (result.affectedRows !== 0) {
            res.send({
              message: "取消点赞成功",
            });
          }
        });
      }
    });
  }
);
module.exports = {
  findMostViews,
  uploadNewFoods,
  collectMostViews,
  giveThumbsMostViews,
  userViewsFoods,
  findCollectFoods,
  findGiveThumbsFoods,
  findAllFoods,
  findShopAllFoods,
  findAllShops,
  findShopAllTypeFoods,
  findShopypeAllFoods,
  findShopFoodsDetails,
  addViewFoods,
  updateCollectFoods,
  updateFoodsThumbs,
};
