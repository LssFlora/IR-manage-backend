const express = require('express');
const router = express.Router()
const routerHandler = require('../router_handler/user');
//引入验证规则的中间件
const expressJoi = require('@escook/express-joi');
// 引入验证规则
const schema = require('../schema/user');
// 引入登录注册表单验证规则
const { reg_schema, login_schema, code_schema } = schema
// 验证码接口
router.get("/captcha", routerHandler.getCode)
// 新增用户接口
router.post("/register", routerHandler.regUser)
// 登录接口
router.post("/login", routerHandler.loginUser)
// 获取所有用户接口
router.get("/getAllUser", routerHandler.getAllUser)
// 删除用户接口
router.delete("/deleteUser", routerHandler.deleteUser)

module.exports = router