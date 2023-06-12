const db = require('../db/index');
const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js");
const jwtConfig = require('../config');
const svgCaptcha = require('svg-captcha');
const url = require('url');
const moment = require('moment');
const { decrypt, encrypt } = require("../utils/decrypt")

let storedCaptcha;
// 新增用户处理函
exports.regUser = (req, res) => {
    // console.log("req.body", req.body);
    const { userName, password, role } = req.body
    // 合法性校验
    if (!userName || !password) return res.send({
        code: 400,
        msg: "用户名或密码为空"
    })
    // 查询所有用户名sql语句
    const selectSql = 'select * from admin_info where account_number=?'
    db.query(selectSql, [userName], (err, results) => {
        console.log("results", results);
        // 用户名占用情况
        if (results.length > 0) return res.send({
            code: 400,
            msg: "用户名已被占用!"
        })
        // 获取年月日
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let createTime = `${year}-${month}-${day}`
        // 新增用户sql语句
        const regSql = "insert into admin_info set ?"
        // 执行sql新增用户
        db.query(regSql, { account_number: userName, password: encrypt(password), authority: role, createtime: createTime }, (err, results) => {
            if (err) return res.cc(403, "注册失败")
            if (results.affectedRows === 1) return res.cc(200, "注册成功")
        })
    })
}
// 获取图行验证码
exports.getCode = (req, res) => {
    const captcha = svgCaptcha.create({
        inverse: false, // 翻转颜色
        fontSize: 48, // 字体大小
        noise: 2, // 干扰线条数
        width: req.query.width || 150, // 宽度
        height: req.query.height || 50, // 高度
        size: 4, // 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        color: true, // 验证码是否有彩色
        background: '#cc9966', // 验证码图片背景颜色
    })
    //保存到cookie,忽略大小写
    console.log("生成验证码：", captcha.text.toLowerCase());
    storedCaptcha = captcha.text.toLowerCase();
    res.cookie('captcha', captcha.text.toLowerCase())
    res.type('svg')
    res.send(captcha.data)
}

// 登录接口注册函数
exports.loginUser = (req, res) => {
    const { userName, password, code } = req.body
    // 验证验证码正确性
    if (code.toLowerCase() !== storedCaptcha) {
        res.send({ success: false, code: 400, msg: '验证码输入错误' })
        return
    } else {
        // 登录用户名查询语句
        const loginSql = "select * from admin_info where account_number=?"
        db.query(loginSql, userName, (err, results) => {
            if (err) return res.send({
                code: 401,
                msg: "无权访问！",
            })
            // 结果合法性校验
            if (results.length !== 1) return res.send({ code: 403, msg: "用户名不存在！" })
            // 密码是否正确比较
            let dePassword = encrypt(password)
            let sqlPassword = results[0].password
            console.log("11", dePassword);
            console.log("22", decrypt(sqlPassword));
            if (dePassword != sqlPassword) return res.send({ code: 400, msg: "密码错误！" })
            if (results[0].authority.indexOf("4") != -1) {
                const user = { ...results[0], password: "" }
                // 生成token
                const token = jwt.sign(user, jwtConfig.jwtSecretKey, {
                    expiresIn: "10h"
                })
                console.log("登陆成功 token为", token);
                // 返回token与数据
                res.send({
                    code: 200,
                    msg: "登录成功",
                    token: token
                })
            } else {
                res.send({
                    code: 403,
                    msg: "无权访问！",
                })
            }
        })
    }
}
// 获取所有用户处理函数
exports.getAllUser = (req, res) => {
    const sql = "select * from admin_info"
    db.query(sql, (err, results) => {
        if (err) return res.send({
            code: 403,
            msg: "获取失败"
        })
        // 设置createtime字段为日期格式
        const formattedResults = results.map((row) => {
            const formattedRow = { ...row };
            formattedRow.createtime = moment(formattedRow.createtime).format('YYYY-MM-DD');
            return formattedRow;
        });
        res.send({
            code: 200,
            msg: "成功",
            data: formattedResults
        })
    })
}

// 删除用户处理函数
exports.deleteUser = (req, res) => {
    const { id } = url.parse(req.url, true).query
    const sql = "delete from admin_info where id=?"
    db.query(sql, id, (err, results) => {
        if (err) return res.send({
            code: 403,
            msg: err
        })
        if (results.affectedRows == 1) {
            res.send({
                code: 200,
                msg: "成功",
            })
        }
    })
}
