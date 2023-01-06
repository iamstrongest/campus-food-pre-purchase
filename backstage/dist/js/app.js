const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// 解析axios发送的josn数据，axios发送的data，默认是josn格式，而node默认是urlencoded格式的
/**
 * 使用bodyParser
 * 使用bodyParser.json({ extended: true, limit: "100mb" })解析application/josn格式的上传文件，打破100kb的限制
 *  使用bodyParser.urlencoded({ limit: "100mb", extended: true })解析application/x-www-form-urlencoded格式的上传文件，打破100kb的限制
 */

// app.use(bodyParser.json({ extended: true, limit: "100mb" }));
// app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
/**
 * 或使用express
 * 使用express.json({ extended: true, limit: "100mb" })解析application/josn格式的上传文件，打破100kb的限制
 *  使用express.urlencoded({ limit: "100mb", extended: true })解析application/x-www-form-urlencoded格式的上传文件，打破100kb的限制
 */
app.use(express.json({ extended: true, limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
// 配置跨越请求
const cors = require("cors");

app.use(cors());

const router = require("./router.js");

app.use("/api", router);
app.listen(3002, function () {
  console.log("http://127.0.0.1:80 为您服务");
});
