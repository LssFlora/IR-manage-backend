//项目入口文件

const port = 3000
const express = require('express')
const app = express()
// 引入跨域
const cors = require('cors')
// 引入验证规则模块
const joi = require('joi');
// token解析模块
const expressJwt = require('express-jwt');
const config = require('./config');
// 引入登陆注册路由模块
const useRouter = require('./router/user');
// 引入个人中心路由模块
const userInfoRouter = require('./router/userInfo');
// 第三方解析模块
const bodyParser = require('body-parser');

// 开启跨域
app.use(cors())
// 设置urlencoded格式的请求数据
app.use(express.urlencoded({ extended: false }))
// 解析 application/x-www-form-urlencoded 格式
app.use(bodyParser.urlencoded({ extended: false }));
// 解析 application/json 格式
app.use(bodyParser.json());


// 封装一个res.send返回错误信息·的全局中间件，
app.use((req, res, next) => {
    res.cc = (code = 1, err) => {
        res.send({
            code,
            msg: err instanceof Error ? err.message : err
        })
    }
    next()
})
// 解析带来的token数据以及设置哪些请求不需要带token,解析的token自动存在req.user里（因为token生成时的数据名是user）
app.use(expressJwt({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

// 注册登录注册路由全局中间件
app.use("/api", useRouter)
// 注册用户中心路由全局中间件
app.use("/my", userInfoRouter)



//错误级别中间件
app.use((err, req, res, next) => {
    // 注册信息验证失败错误
    if (err instanceof joi.ValidationError) return res.cc(1, err)
    if (err.name === "UnauthorizedError") return res.cc("身份认证失败")
    res.cc(err)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))