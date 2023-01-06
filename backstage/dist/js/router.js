const express = require("express");
const secretKey = "strongest ^0^";
const jwt = require("jsonwebtoken");
const { decrypt } = require("decrypt-core");
const { getId } = require("./utils");
const { sendMails } = require("./email");
const { getRandom } = require("./email/function");
// const { findUsers } = require("./aboutUser");
const key = "159strongest-qiang-110119120";
// express-jwt 最新版本使用方式，用于解析生成的token
// 解码后的 JWT 有效负载现在可用作 req.auth 而不是 req.user
// 我们只是为了获取token，并不需要解析token，不配置这个中间件也行
var { expressjwt: expressJWT } = require("express-jwt");
express().use(expressJWT({ secret: secretKey, algorithms: ["HS256"] }));

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

// 用户操作-----------------------------------------------------------------------------------------------
/**
 * 所有用户查询
 * router.get("/users", function (req, res) {
 *  db.query("SELECT * FROM users", function (err, result) {
 * if (err) return console.log(err.message);
 * res.send(result);
 * });
 * });
 */

// 用户查看个人资料
router.get("/users/:id", async function (req, res) {
  let personally = {};
  await new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM users where id=${req.params.id}`,
      function (err, result) {
        if (err) return console.log(err.message);
        personally = result[0];
        delete personally.password;
        delete personally.evidence;
        resolve(personally);
      }
    );
  });
  await new Promise((resolve, reject) => {
    db.query(
      `SELECT foodId FROM give_food_collection where userId=${req.params.id}`,
      function (err, result) {
        if (err) return console.log(err.message);
        personally.collect = result.map((item) => item.foodId);
        resolve(personally);
      }
    );
  });
  await new Promise((resolve, reject) => {
    db.query(
      `SELECT foodId FROM give_food_thumbs where userId=${req.params.id}`,
      function (err, result) {
        if (err) return console.log(err.message);
        personally.loves = result.map((item) => item.foodId);
        resolve(personally);
      }
    );
  });
  await new Promise((resolve, reject) => {
    db.query(
      `SELECT foodId FROM views where userId=${req.params.id}`,
      function (err, result) {
        if (err) return console.log(err.message);
        personally.views = result.map((item) => item.foodId);
        res.send(personally);
      }
    );
  });
});
// 查询某用户收到赞的数量
router.get("/user/getThumbsNumber", (req, res) => {
  const sql = `select * from give_reply_thumbs where replyUserId=${req.query.loginId}`;
  db.query(sql, (err, result) => {
    res.send({
      number: result.length,
    });
  });
});
// 查询某用户收到回复的数量
router.get("/user/getReplysNumber", (req, res) => {
  const sql = `select * from reply where username="${req.query.username}"`;
  db.query(sql, (err, result) => {
    res.send({
      number: result.length,
    });
  });
});
// 用户退出，更新login值
router.put("/users/:id/update/loginOut", function (req, res) {
  db.query(
    `SELECT * FROM users where id=${req.params.id}`,
    function (err, result) {
      if (err) return console.log(err.message);
      db.query(
        `update FROM users where id=${req.params.id}`,
        function (err, result) {
          if (err) return console.log(err.message);
          const sql = "update users set login=? where id=?";
          const params = [1, req.body.id];
          db.query(sql, params, function (err, result) {
            if (result.affectedRows !== 0) {
              res.send({
                message: "退出登录成功",
              });
            }
          });
        }
      );
    }
  );
});

// 用户更新头像
router.put("/users/:id/update/image", function (req, res) {
  db.query(
    `SELECT * FROM users where id=${req.params.id}`,
    function (err, result) {
      if (err) return console.log(err.message);
      const sql = "update users set imageUrl=? where id=?";
      const params = [req.body.imageUrl, req.params.id];
      db.query(sql, params, function (err, result) {
        if (result.affectedRows !== 0) {
          res.send({
            message: "更新头像成功",
          });
        }
      });
    }
  );
});

// 用户更新个人信息
router.put("/users/:id/update/personal", function (req, res) {
  db.query(
    `SELECT * FROM users where username='${req.body.username}'`,
    function (err, result) {
      if (err) return console.log(err.message);
      if (result.length > 0) {
        res.send({
          message: "昵称已被占用,请您更换其它昵称",
        });
      }
    }
  );
  db.query(
    `SELECT * FROM users where id="${req.params.id}"`,
    function (err, result) {
      let sql, params;
      if (err) return console.log(err.message);
      if (req.body.username.length != 0) {
        sql = "update users set username=? ,reduction=? where id=?";
        params = [req.body.username, req.body.reduction, req.params.id];
      } else {
        sql = "update users set reduction=? where id=?";
        params = [req.body.reduction, req.params.id];
      }
      db.query(sql, params, function (err, result) {
        if (err) return console.log(err.message);
        if (result.affectedRows !== 0) {
          res.send({
            message: "更新个人信息成功",
          });
        }
      });
    }
  );
});
// 用户找回密码
router.post("/find/password", function (req, res) {
  let message;
  const decData1 = decrypt(req.body.id, key);
  const decData2 = decrypt(req.body.evidence, key);
  db.query(`SELECT * FROM users where id=${decData1}`, function (err, result) {
    if (err) return console.log(err.message);
    if (result.length == 0) {
      res.send({
        message: "账号不存在",
      });
    } else {
      result[0].evidence == decData2
        ? (message = result[0].password)
        : (message = "凭证错误");
      res.send({
        message,
      });
    }
  });
});

// 用户更新密码
router.put("/users/:id/update/password", function (req, res) {
  db.query(
    `SELECT evidence FROM users where id=${req.params.id}`,
    function (err, result) {
      if (err) return console.log(err.message);
      if (result[0].evidence == req.body.evidence) {
        const sql = "update users set password=? where id=?";
        const params = [req.body.password, req.params.id];
        db.query(sql, params, function (err, result) {
          if (result.affectedRows !== 0) {
            res.send({
              message: "更新密码成功",
            });
          }
        });
      } else {
        res.send({
          message: "凭证错误,请重新输入",
        });
      }
    }
  );
});

// 用户暂时封禁
router.put("/users/:id/update/status", function (req, res) {
  db.query(
    `SELECT * FROM users where id=${req.params.id} `,
    function (err, result) {
      if (err) return console.log(err.message);
      let sql;
      req.params.status == 0
        ? (sql = `update users set status=0 where id=${req.params.id}`)
        : (sql = `update users set status=1 where id=${req.params.id}`);

      db.query(sql, function (err, result) {
        if (req.params.status == 0) {
          if (result.affectedRows !== 0) {
            res.send({
              message: "用户以解冻 ",
            });
          }
        } else {
          if (result.affectedRows !== 0) {
            res.send({
              message: "用户以冻结 ",
            });
          }
        }
      });
    }
  );
});

// 用户删除
router.delete("/users/:id", function (req, res) {
  db.query(
    `SELECT * FROM users where id=${req.params.id} key=${req.body.key} `,
    function (err, result) {
      if (err) return console.log(err.message);
      db.query(
        `delete FROM users where id=${req.params.id}`,
        function (err, result) {
          if (err) return console.log(err.message);
          if (result.affectedRows !== 0) {
            res.send({
              message: "用户删除成功 ",
            });
          }
        }
      );
    }
  );
});

// 用户主账号登录
router.post("/login", function (req, res) {
  const tokenStr = jwt.sign({}, secretKey, {
    expiresIn: "10d",
  });
  const id = decrypt(req.body.id, key);
  const password = decrypt(req.body.password, key);
  db.query("SELECT * FROM users", function (err, result) {
    if (err) return console.log(err.message);
    const personally = result.filter((item) => item.id == id)[0];
    if (personally != null) {
      if (personally.password == password) {
        // 删除发送过去给客户端的密码和key值
        delete personally.password;
        delete personally.evidence;
        db.query(
          `update users set login=0 where id=${id}`,
          function (err, result) {
            if (result.affectedRows !== 0 && personally.status != 1) {
              res.send({
                // login: 0,
                // token: `Bearer ${tokenStr}`,
                message: "登录成功",
                data: personally,
                token: tokenStr,
              });
            } else {
              res.send({
                message: "账号已冻结,请联系管理员",
              });
            }
          }
        );
      } else {
        res.send({ message: "密码错误" });
      }
    } else {
      res.send({ message: "账号不存在" });
    }
  });
});
// 用户邮箱登录
router.post("/login/email", function (req, res) {
  const email = decrypt(req.body.email, key);
  const password = decrypt(req.body.password, key);
  db.query("SELECT * FROM users", function (err, result) {
    if (err) return console.log(err.message);
    const personally = result.filter((item) => item.email == email)[0];
    if (personally != null) {
      if (personally.password == password) {
        // 删除发送过去给客户端的密码和key值
        delete personally.password;
        delete personally.evidence;
        delete personally.email;
        delete personally.std_No;
        db.query(
          `update users set login=0 where email=${email}`,
          function (err, result) {
            if (result.affectedRows !== 0 && personally.status != 1) {
              res.send({
                message: "登录成功",
                data: personally,
              });
            } else {
              res.send({
                message: "账号已冻结,请联系管理员",
              });
            }
          }
        );
      } else {
        res.send({ message: "密码错误" });
      }
    } else {
      res.send({ message: "邮箱不存在" });
    }
  });
});

// 用户注册
router.post("/registy/", function (req, res) {
  db.query("SELECT * FROM users", function (err, result) {
    if (err) return console.log(err.message);
    const personally = result.filter(
      (item) => item.id == decrypt(req.body.id, key)
    );
    if (personally.length == 0) {
      const sql =
        "insert into users(id,username,password,evidence) VALUES(?,?,?,?)";
      const params = [
        decrypt(req.body.id, key),
        decrypt(req.body.username, key),
        decrypt(req.body.password, key),
        decrypt(req.body.evidence, key),
      ];
      db.query(sql, params, function (err, result) {
        if (err) return console.log(err.message);
        if (result.affectedRows !== 0) {
          res.send({
            message: "注册成功",
          });
        }
      });
    } else {
      res.send({ message: "账号已注册" });
    }
  });
});
//391-480为新增学号注册以及邮箱注册接口
// 用户学号注册
router.post("/registy/std_Nu", function (req, res) {
  db.query("SELECT * FROM users", function (err, result) {
    if (err) return console.log(err.message);
    const personally = result.filter(
      (item) => item.stu_Nu == decrypt(req.body.stu_Nu, key)
    );
    const idList = result.map((item) => item.id);
    if (personally.length == 0) {
      let id = getId(idList);
      const sql =
        "insert into users(id,username,password,evidence,stu_Nu) VALUES(?,?,?,?,?)";
      const params = [
        id,
        decrypt(req.body.username, key),
        decrypt(req.body.password, key),
        decrypt(req.body.evidence, key),
        decrypt(req.body.stu_Nu, key),
      ];
      db.query(sql, params, function (err, result) {
        if (err) return console.log(err.message);
        if (result.affectedRows !== 0) {
          res.send({
            message: "注册成功",
            id,
          });
        }
      });
    } else {
      res.send({ message: "账号已注册" });
    }
  });
});

//测试邮件
let mailId; //收件人的邮箱账号
var VerificationCode; //验证码
////先查询数据库有没有该邮箱，有的话返回提示已经被注册过了，否者发送验证码
router.post("/send/email", function (req, res) {
  db.query("SELECT email FROM users", function (err, result) {
    if (err) return console.log(err.message);
    const emails = result.filter((item) => item.email == req.body.email);
    if (emails.length == 0) {
      mailId = req.body.email;
      const number = 6; //定义6位验证码
      VerificationCode = getRandom(number); //默认四位验证码，自己可以自定义验证码
      sendMails(mailId, VerificationCode).then((res) => {
        // console.log(res, '返回的数据');
        if (res.response == "250 OK: queued as.") {
          //如果发送成功执行的操作
          console.log("发送成功了，收件人是：" + res.accepted); //是个数组
        } else {
          //发送失败执行的操作
          console.log("发送失败了，错误为：" + res.rejected); //也是个数组
        }
      });
      res.send({
        message: "发送成功",
      });
    } else {
      res.send({
        message: "邮箱已被注册",
      });
    }
  });
});
//开始邮箱注册
router.post("/resgister/email", function (req, res) {
  if (req.body.verificationCode == VerificationCode) {
    db.query("select id from users", (err, result) => {
      const idList = result.map((item) => item.id);
      let id = getId(idList);
      const params = [
        id,
        mailId,
        req.body.password,
        req.body.username,
        req.body.evidence,
      ];
      const sql =
        "insert into users(id,email,password,username,evidence) VALUES(?,?,?,?,?)";
      db.query(sql, params, function (err, result) {
        if (err) return console.log(err.message);
        if (result.affectedRows !== 0) {
          res.send({
            message: `注册成功，您的登录主账号为${id}`,
          });
        }
      });
    });
  }
});

// 添加用户浏览食物记录或者更新浏览历史时间

router.post("/user/add", function (req, res) {
  db.query(
    `SELECT * FROM views where foodId=${req.query.foodId} and userId=${req.body.userId}`,
    function (err, result) {
      if (err) return console.log(err.message);
      // 没有该历史记录则添加，否则更新浏览历史时间
      if (result.length == 0) {
        const sql = "insert views (foodId,userId,viewLastTime) VALUES(?,?,?)";
        db.query(
          sql,
          [req.query.foodId, req.body.userId, req.body.viewLastTime],
          function (err, result) {
            if (err) return console.log(err.message);
            if (result.affectedRows !== 0) {
              res.send({
                message: "添加浏览记录成功",
              });
            }
          }
        );
      } else {
        // 更新浏览历史时间
        const sql = `update views set viewLastTime=${req.body.viewLastTime} where foodId=${req.query.foodId} and userId=${req.body.userId}`;
        db.query(sql, function (err, result) {
          if (err) return console.log(err.message);
          if (result.affectedRows !== 0) {
            res.send({
              message: "浏览记录时间更新成功",
            });
          }
        });
      }
    }
  );
});

// 支付操作

router.put("/users/pay", function (req, res) {
  db.query(
    `SELECT * FROM users where id=${req.body.id}`,
    function (err, result) {
      if (err) return console.log(err.message);
      if (result[0].property - req.body.amount < 0) {
        res.send({
          message: "余额不足,请充值",
        });
      } else {
        const sql = `update users set property=${
          result[0].property - req.body.amount
        } where id=${req.body.id}`;
        db.query(sql, function (err, result) {
          if (err) return console.log(err.message);
          if (result.affectedRows !== 0) {
            res.send({
              message: "支付成功",
            });
          }
        });
      }
    }
  );
});

// 食物操作-----------------------------------------------------------------------------------------------
// 查询浏览最多的食物
router.get("/view/foodlist", function (req, res) {
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
router.get("/upload/foodlist", function (req, res) {
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
router.get("/collect/foodlist", async function (req, res) {
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
          if (index == array.length - 1) {
            res.send({
              data: sendData,
            });
          }
        }
      );
    });
  });
});

// 查询点赞最多的食物
router.get("/giveThumbs/foodlist", async function (req, res) {
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
        .sort((item1, item2) => item2.gvieThumbsNumber - item1.gvieThumbsNumber)
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
            res.send({
              data: sendData,
            });
          }
        }
      );
    });
  });
});

// 查看某用户浏览过的食物
router.post("/user/views", async function (req, res) {
  const views = [];
  let viewLastTime = 0;
  const foodViews = req.body.foodViews;
  for await (foodId of foodViews) {
    viewLastTime = await new Promise((resolve, reject) => {
      db.query(
        `SELECT viewLastTime FROM views where foodId=${foodId} and userId=${req.body.userId}`,
        function (err, result) {
          if (err) return console.log(err.message);
          resolve(result[0].viewLastTime);
        }
      );
    });
    await new Promise((resolve, reject) => {
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
router.post("/user/collect", async function (req, res) {
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
router.post("/user/love", async function (req, res) {
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
router.get("/foodlist", function (req, res) {
  db.query("SELECT * FROM food_description", function (err, result) {
    if (err) return console.log(err.message);
    res.send({
      data: result,
    });
  });
});

// 查询某家店的所有食物
router.get("/foodlist/shopId/:shopId", function (req, res) {
  db.query(
    `SELECT * FROM food_description where shopId=${req.params.shopId}`,
    function (err, result) {
      if (err) return console.log(err.message);
      res.send(result);
    }
  );
});

// 查询所有商家
router.get("/foodlist/shopName", function (req, res) {
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
router.get("/foodlist/shop", async function (req, res) {
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
});

// 查询某商店的某类食物
router.get("/foodlist/shopId/:shopId/kind/", function (req, res) {
  db.query(
    `SELECT * FROM food_description where knid="${req.query.kind}"`,
    function (err, result) {
      if (err) return console.log(err.message);
      res.send(result);
    }
  );
});

// 查询某商店的某样食物详细信息，shopId是商店主码，foodId是食物的主码
router.get(
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

    // promise then 形式
    // const p = new Promise((resolve, reject) => {
    //   db.query(
    //     `SELECT * FROM food_description where foodId=${req.params.foodId} and shopId=${req.params.shopId}`,
    //     function (err, result) {
    //       if (err) return console.log(err.message);
    //       foodDetails.foodId = result[0].foodId;
    //       foodDetails.price = result[0].price;
    //       foodDetails.description = result[0].description;
    //       foodDetails.title = result[0].title;
    //       foodDetails.shopName = result[0].shopName;
    //       foodDetails.type = result[0].type;
    //       foodDetails.viewNumber = result[0].viewNumber;
    //       foodDetails.shopId = result[0].shopId;
    //       foodDetails.kind = result[0].kind;
    //       foodDetails.foodImageUrl = result[0].foodImageUrl;
    //       resolve(foodDetails);
    //     }
    //   );
    // })
    //   .then((result) => {
    //     console.log(result);
    //     return new Promise((resolve, reject) => {
    //       db.query(
    //         `SELECT userId FROM give_food_collection where foodId=${req.params.foodId}`,
    //         function (err, result) {
    //           if (err) return console.log(err.message);
    //           foodDetails.giveUserCollectionNumber = result.length;
    //           foodDetails.giveUsersCollection = result.map((item) => item.userId);
    //           resolve(foodDetails);
    //         }
    //       );
    //     });
    //   })
    //   .then((result) => {
    //     console.log(result);
    //     return new Promise((resolve, reject) => {
    //       db.query(
    //         `SELECT userId FROM give_food_thumbs where foodId=${req.params.foodId}`,
    //         function (err, result) {
    //           if (err) return console.log(err.message);
    //           foodDetails.giveUserThumbsNumber = result.length;
    //           foodDetails.giveUserThumbs = result.map((item) => item.userId);
    //           resolve(foodDetails);
    //         }
    //       );
    //     });
    //   })
    //   .then((result) => {
    //     res.send(result);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   })
    //   .finally((done) => {
    //     console.log("promise resolved");
    //   });
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
router.put("/foodlist/foodId/:foodId", function (req, res) {
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
router.put("/foodlist/foodId/:foodId/collect/", function (req, res) {
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
});

// 商品点赞与否,foodId是商品号，根据有无userid判断是否收藏或者删除
router.put("/foodlist/foodId/:foodId/giveThumbs", function (req, res) {
  const sql1 = `SELECT * FROM give_food_thumbs where foodId=${req.params.foodId} and userId=${req.body.userId}`;
  db.query(sql1, function (err, result) {
    if (err) return console.log(err.message);
    if (result == 0) {
      const sql2 = "insert into give_food_thumbs (foodId,userId) VALUES(?,?);";
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
});

// 评论区操作-----------------------------------------------------------------------------------------------

// 展示某食物所有楼主级评论
router.get("/conments/landlord/foodId/:foodId", async (req, res) => {
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
        item.floors > landlordLastLord ? (landlordLastLord = item.floors) : "";
      });
      res.send({
        data,
        landlordLastLord,
      });
    });
  });
});

/**
 * 点击某一页，就展示该页的数据
 * 默认一页展示number条数据，
 * foodId表示展示这个食物的评论，
 * page表示传过来的页数,并且展示最新的，因此要将数组转置
 *  */
router.get(
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
router.get(
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
router.get(
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
router.put("/foodlist/landlord/:landlordId/update", function (req, res) {
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
});
// 更新回复者点赞总数，replyConmentId表示回复的话题的主码
router.put(
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
router.post("/conments/push/type/:type", function (req, res) {
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
// 权限管理人员和商家操作-----------------------------------------------------------------------------------------------

// 权限管理人员查询
router.get("/manager/find", function (req, res) {
  db.query("SELECT * FROM manager", function (err, result) {
    if (err) return console.log(err.message);
    res.send(result);
  });
});
// 权限管理人员登录,并且展示所有商家
router.post("/manager/login", function (req, res) {
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

router.get("/manager/all", (req, res) => {
  db.query("SELECT * FROM shopkeeper", function (err, result) {
    if (err) return console.log(err.message);
    res.send(result);
  });
});

// 权限管理人员添加商家
router.post("/add/shopkeeper", async function (req, res) {
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
router.put("/put/shopkeeper/shopkeeperId/:shopkeeperId", function (req, res) {
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
});

// 权限管理人员删除商家
router.delete("/delete/shopkeeper/:shopkeeperId", function (req, res) {
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
});

// 查询所有商家
router.get("/shopkeeper", function (req, res) {
  db.query("SELECT * FROM shopkeeper", function (err, result) {
    if (err) return console.log(err.message);
    res.send(result);
  });
});
// 商家登录

router.post("/shopkeeper/login", function (req, res) {
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
router.get("/get/shopkeeper/food", function (req, res) {
  db.query(
    `SELECT * FROM food_description where shopId="${req.query.shopId}"`,
    function (err, result) {
      if (err) return console.log(err.message);
      res.send(result);
    }
  );
});
// 商家添加食物
router.post("/add/shopkeeper/food", function (req, res) {
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
router.put("/put/shopkeeper/food", function (req, res) {
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
router.delete("/delete/shopkeeper/food/:foodId", function (req, res) {
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
});
// router.use("", findUsers);
module.exports = router;
