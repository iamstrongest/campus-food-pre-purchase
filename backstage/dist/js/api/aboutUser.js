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
const secretKey = "strongest ^0^";
const jwt = require("jsonwebtoken");
const { decrypt } = require("decrypt-core");
const { getId } = require("../utils");
const { sendMails } = require("../email");
const { getRandom } = require("../email/function");
const key = "159strongest-qiang-110119120";
// express-jwt 最新版本使用方式，用于解析生成的token
// 解码后的 JWT 有效负载现在可用作 req.auth 而不是 req.user
// 我们只是为了获取token，并不需要解析token，不配置这个中间件也行
var { expressjwt: expressJWT } = require("express-jwt");
express().use(expressJWT({ secret: secretKey, algorithms: ["HS256"] }));

// 用户查看个人资料
let findPersonlyUserData = router.get("/users/:id", async function (req, res) {
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
let findGiveThumbs = router.get("/user/getThumbsNumber", (req, res) => {
  const sql = `select * from give_reply_thumbs where replyUserId=${req.query.loginId}`;
  db.query(sql, (err, result) => {
    res.send({
      number: result.length,
    });
  });
});
// 查询某用户收到回复的数量
let replyLength = router.get("/user/getReplysNumber", (req, res) => {
  const sql = `select * from reply where username="${req.query.username}"`;
  db.query(sql, (err, result) => {
    res.send({
      number: result.length,
    });
  });
});
// 用户退出，更新login值
let loginOut = router.put("/users/:id/update/loginOut", function (req, res) {
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
let updateImage = router.put("/users/:id/update/image", function (req, res) {
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
let updatePersonlyData = router.put(
  "/users/:id/update/personal",
  function (req, res) {
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
  }
);
// 用户找回密码
let findPwd = router.post("/find/password", function (req, res) {
  console.log(req.body.id);
  console.log(req.body.evidence);
  let message;
  const decData1 = decrypt(req.body.id, key);
  const decData2 = decrypt(req.body.evidence, key);
  console.log(decData1, decData2);
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
let updatePwd = router.put("/users/:id/update/password", function (req, res) {
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
let updateStatus = router.put("/users/:id/update/status", function (req, res) {
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
let deleteUser = router.delete("/users/:id", function (req, res) {
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
let loginInId = router.post("/login", function (req, res) {
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
let loginInEmail = router.post("/login/email", function (req, res) {
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
let registy = router.post("/registy/", function (req, res) {
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
let registyStd_Nu = router.post("/registy/std_Nu", function (req, res) {
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
let sendEmail = router.post("/send/email", function (req, res) {
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
let registyEmail = router.post("/resgister/email", function (req, res) {
  if (req.body.verificationCode == VerificationCode) {
    console.log(VerificationCode);
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
// 支付操作

let payment = router.put("/users/pay", function (req, res) {
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
let findUsers = router.get("/users", function (req, res) {
  db.query("SELECT * FROM users", function (err, result) {
    if (err) return console.log(err.message);
    res.send(result);
  });
});
module.exports = {
  findPersonlyUserData,
  findGiveThumbs,
  replyLength,
  loginOut,
  updateImage,
  updatePersonlyData,
  findPwd,
  updatePwd,
  updateStatus,
  deleteUser,
  loginInId,
  loginInEmail,
  registy,
  registyStd_Nu,
  sendEmail,
  registyEmail,
  payment,
  findUsers,
};
