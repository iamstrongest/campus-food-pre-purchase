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

// 评论区操作-----------------------------------------------------------------------------------------------

// 展示某食物所有楼主级评论
let findLandlord = router.get(
  "/conments/landlord/foodId/:foodId",
  async (req, res) => {
    let data;
    let landlordLastLord = 0;
    data = await new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM landlord where foodId=${req.params.foodId}`,
        function (err, result) {
          if (err) return console.log(err.message);
          resolve(result);
        }
      );
    });

    await new Promise((resolve, reject) => {
      db.query(`SELECT * FROM landlord `, function (err, result) {
        if (err) return console.log(err.message);
        result.forEach((item) => {
          item.floors > landlordLastLord
            ? (landlordLastLord = item.floors)
            : "";
        });
        res.send({
          data,
          landlordLastLord,
        });
      });
    });
  }
);

/**
 * 点击某一页，就展示该页的数据
 * 默认一页展示number条数据，
 * foodId表示展示这个食物的评论，
 * page表示传过来的页数,并且展示最新的，因此要将数组转置
 *  */
let showLandlordSomePage = router.get(
  "/conments/landlord/foodId/:foodId/page/:page",
  async function (req, res) {
    const number = 3;

    let now = 0; //用于判断啥时候发送数组给客户端
    let array = [];
    // 以下代码有问题
    await new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM landlord where foodId=${req.params.foodId}`,
        function (err, result) {
          if (err) return console.log(err.message);
          if (result.length == 0) {
            res.send({
              data: [],
            });
          } else {
            array = result.map((item) => {
              item.giveLandlordThumbsNumber = 0;
              item.giveLandlordThumbs = [];
              return item;
            });
            resolve("部分获取ok");
          }
        }
      );
    });
    await new Promise((resolve, reject) => {
      array.forEach(async (item) => {
        db.query(
          `SELECT userId FROM give_landlord_thumbs where landlordId=${item.floors}`,
          function (err, result) {
            if (err) return console.log(err.message);
            item.giveLandlordThumbsNumber = result.length;
            item.giveLandlordThumbs = result.map((item) => item.userId);
            now++;
            if (now == array.length) {
              res.send({
                data: array
                  .reverse()
                  .slice(
                    (req.params.page - 1) * number,
                    req.params.page * number
                  ),
                pageSize: number,
              });
            }
          }
        );
      });
      resolve("完整获取ok");
    });
  }
);

// 展示某食物某楼层下的所有回复的评论
let showFoodLandlordAllReply = router.get(
  "/conments/reply/foodId/:foodId/floors/:floors",
  function (req, res) {
    db.query(
      `SELECT * FROM reply where foodId=${req.params.foodId} and floors=${req.params.floors}`,
      function (err, result) {
        if (err) return console.log(err.message);
        res.send({ data: result.reverse() });
      }
    );
  }
);

/**
 * foodId表示展示这个食物的评论
 * floors表示要展示该楼主层的所有回复者
 * page表示要展示的页数
 * 默认一页展示number条数据
 */
let showLandlordReplySomePage = router.get(
  "/conments/reply/foodId/:foodId/floors/:floors/page/:page",
  async function (req, res) {
    const number = 3;
    let now = 0; //用于判断啥时候发送数组给客户端
    let array = [];
    await new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM reply where foodId=${req.params.foodId} and floors=${req.params.floors}`,
        function (err, result) {
          if (err) return logger.error(err);
          if (result.length === 0) {
            res.send({ data: [] });
          } else {
            array = result.map((item) => {
              item.giveReplyThumbsNumber = 0; //几率点赞的总数
              item.giveReplyThumbs = []; //记录点赞的id，避免重复点赞
              return item;
            });
          }
          resolve("部分获取ok");
        }
      );
    });
    await new Promise((resolve, reject) => {
      array.forEach(async (item) => {
        db.query(
          `SELECT replyUserId FROM give_reply_thumbs where replyConmentId=${item.replyConmentId}`,
          function (err, result) {
            if (err) return logger.error(err);
            item.giveReplyThumbsNumber = result.length;
            item.giveReplyThumbs = result.map((item) => item.replyUserId);
            now++;
            if (now == array.length) {
              res.send({
                data: array
                  .reverse()
                  .slice(
                    (req.params.page - 1) * number,
                    req.params.page * number
                  ),
                pageSize: number,
              });
            }
          }
        );
      });
      resolve("完整获取ok");
    });
  }
);

// 更新楼主级别点赞总数,landlordId表示楼主的楼层
let updateLandlordThumbs = router.put(
  "/foodlist/landlord/:landlordId/update",
  function (req, res) {
    const sql1 = `SELECT * FROM give_landlord_thumbs where landlordId=${req.params.landlordId} and userId=${req.body.userId}`;
    db.query(sql1, function (err, result) {
      if (err) return console.log(err.message);
      if (result == 0) {
        const sql2 =
          "insert into give_landlord_thumbs (landlordId,userId) VALUES(?,?);";
        db.query(
          sql2,
          [req.params.landlordId, req.body.userId],
          function (err, result) {
            if (result.affectedRows !== 0) {
              res.send({
                message: "添加楼主级别点赞成功",
              });
            }
          }
        );
      } else {
        const sql2 = `delete from give_landlord_thumbs where landlordId=${req.params.landlordId} and userId=${req.body.userId}`;
        db.query(sql2, function (err, result) {
          if (result.affectedRows !== 0) {
            res.send({
              message: "取消楼主级别点赞成功",
            });
          }
        });
      }
    });
  }
);
// 更新回复者点赞总数，replyConmentId表示回复的话题的主码
let LandlordReplyThumbs = router.put(
  "/foodlist/reply/replyConmentId/:replyConmentId/update",
  function (req, res) {
    const sql1 = `SELECT * FROM give_reply_thumbs where replyConmentId=${req.params.replyConmentId} and replyUserId=${req.body.replyUserId}`;
    db.query(sql1, function (err, result) {
      if (err) return console.log(err.message);
      if (result == 0) {
        const sql2 =
          "insert into give_reply_thumbs (replyConmentId,replyUserId) VALUES(?,?);";
        db.query(
          sql2,
          [req.params.replyConmentId, req.body.replyUserId],
          function (err, result) {
            res.send({
              message: "添加回复级别点赞成功",
            });
          }
        );
      } else {
        const sql2 = `delete from give_reply_thumbs where replyConmentId=${req.params.replyConmentId} and replyUserId=${req.body.replyUserId}`;
        db.query(sql2, function (err, result) {
          res.send({
            message: "取消回复级别点赞成功",
          });
        });
      }
    });
  }
);

// 添加评论，type为1表示楼主级别添加，type为2表示回复者
let addComment = router.post("/conments/push/type/:type", function (req, res) {
  let sql = "";
  if (req.params.type == 1) {
    sql =
      "insert into landlord (conment,date,username,imageUrl,floors,foodId)VALUES(?,?,?,?,?,?)";
    const params = [
      req.body.data.conment,
      req.body.data.date,
      req.body.data.username,
      req.body.data.imageUrl,
      req.body.data.floors,
      req.body.data.foodId,
    ];
    db.query(sql, params, function (err, result) {
      if (err) return console.log(err.message);
      if (result.affectedRows !== 0) {
        res.send({
          message: "楼主发送成功",
        });
      }
    });
  } else {
    sql =
      "insert into reply (conment,date,username,imageUrl,floors,foodId,replyUsername)VALUES(?,?,?,?,?,?,?)";
    const params = [
      req.body.data.conment,
      req.body.data.date,
      req.body.data.username,
      req.body.data.imageUrl,
      req.body.data.floors,
      req.body.data.foodId,
      req.body.data.replyUsername,
    ];
    db.query(sql, params, function (err, result) {
      if (err) return console.log(err.message);
      if (result.affectedRows !== 0) {
        res.send({
          message: "回复者发送成功",
        });
      }
    });
  }
});
module.exports = {
  findLandlord,
  showLandlordSomePage,
  showFoodLandlordAllReply,
  showLandlordReplySomePage,
  updateLandlordThumbs,
  addComment,
  LandlordReplyThumbs,
};
