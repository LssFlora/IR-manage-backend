const express = require('express');
const router = express.Router()
const expressJoi = require('@escook/express-joi');
const schema = require('../schema/user');
const userInfoFun = require('../router_handler/userInfoFun');

// 获取用户信息接口
router.get("/getUserInfo", userInfoFun.getUserInfo)
// 更新用户信息接口
router.post("/newUserInfo", expressJoi(schema.update_user_schema), userInfoFun.updateUserInfo)
// 重置密码接口
router.post("/updatePwd", expressJoi(schema.updatePwd_schema), userInfoFun.updatePwd)

module.exports = router