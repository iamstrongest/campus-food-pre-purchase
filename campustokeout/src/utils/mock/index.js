import Mock from "mockjs";
export default [
  {
    url: "/api/getFoodList",
    method: "get",
    response: () => {
      return {
        code: 0,
        message: "ok",
        "data|12": [
          {
            id: "@id",
            title: "@ctitle",
            shopname: "@ctitle(1,10)",
            description: "@cparagraph(1, 3)",
            "price|1-20": 5,
            "loveNumber|0-1000000000": 0,
            "collectNumber|0-1000000000": 0,
            "historyNumber|0-1000000000": 0,
            url: function () {
              //随机演示图片
              return Mock.Random.image("200x100", "#4A7BF7", this.title);
            },
            giveThumbs: [2020, 2021, 2022, 2023],
            giveCollection: [2020, 2021, 2022, 2023],
          },
        ],
      };
    },
  },
  {
    url: "/api/onepost",
    method: "get",
    response: () => {
      return {
        code: 0,
        message: "ok",
        "data|12": [
          {
            id: "@id",
            title: "@ctitle",
          },
        ],
      };
    },
  },
  {
    url: "/api/tworeply",
    method: "get",
    response: () => {
      return {
        code: 0,
        message: "ok",
        "data|12": [
          {
            id: "@id",
            cname: "@cname",
            reply: "@cpassage",
            description: "@cparagraph(1, 3)",
            givethumbs: [2020, 2021],
          },
        ],
      };
    },
  },
  // {
  //   url: "/api/login",
  //   method: "post",
  //   status: 200,
  //   rawResponse: (req, res) => {
  //     console.log(req);
  //     res.setHeader("Content-Type", "text/plain");
  //     res.statusCode = 200;
  //     res.end(req);
  //   },
  // },
];
