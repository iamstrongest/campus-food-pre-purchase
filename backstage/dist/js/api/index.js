const express = require("express");

const router = express.Router();

const aboutComment = require("./aboutComment");
const aboutUser = require("./aboutUser");
const aboutFood = require("./aboutFood");
const aboutManager = require("./aboutManager");
const aboutShopkeeper = require("./aboutShopkeeper");
const allApi = [];
allApi.push(
  ...Object.values(aboutComment),
  ...Object.values(aboutFood),
  ...Object.values(aboutManager),
  ...Object.values(aboutShopkeeper),
  ...Object.values(aboutUser)
);
allApi.forEach((element) => {
  router.use("", element);
});
module.exports = router;
