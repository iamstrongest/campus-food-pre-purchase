# backstage

## 安装包
```js 
npm install
```

### router.js里面的配置
```js
找到
const db=mysql.createPool({
host :"127.0.0.1",
user: "root",
password: "123456"
database:"hrmsystem",
}) 这段代码

将里面的 user 换成你自己mysql的用户名 比如"root"
将 password 换成 你自己mysql的密码 比如"123456"
nodemon app.js
```



### mysql 相关
#### 新建一个hrmsystem数据库
#### 在hrmsystem数据库中新建三张表，分别是employee和personal_salary以及register
1. employee字段即empID，employeeName，employeePhone，employeeSex，employeeSalary，employeePosition
2. register字段 regID，regPassword，registerName
3. personal_salary字段 empID Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec employeeName

### 服务器启动
```js
//首先进入js目录，然后启动终端
nodemon app.js
```

