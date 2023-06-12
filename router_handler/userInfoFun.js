const db = require('../db/index');
// 引入加密模块
const bcrypt = require('bcryptjs');
// 获得用户信息处理函数
exports.getUserInfo = (req, res) => {
    const getUserSql = "select username,nikiname,email,user_pic from ev_users where id=?"
    db.query(getUserSql, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc(1, results[0])
        res.send({ status: 0, msg: "用户信息获取成功", data: results[0] })
    })
}
// 更新用户信息处理函数
exports.updateUserInfo = (req, res) => {
    const updateSql = "update ev_users set ? where id=?"
    db.query(updateSql, [req.body, req.user.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) {
            // this.getUserInfo()
            return res.cc(results)
        }
        return res.send({ status: 0, msg: "用户信息更新成功" })
    })
}

// 重置密码处理函数
exports.updatePwd = (req, res) => {
    const { oldPwd, newPwd } = req.body
    const comfirmPwdSql = "select * from ev_users where id=?"
    db.query(comfirmPwdSql, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc("update passwword faile")
        // 验证旧密码是否正确
        if (!bcrypt.compareSync(oldPwd, results[0].password)) return res.cc("原密码错误")
        // 加密新密码
        password = bcrypt.hashSync(newPwd, 10)
        const updatePwdSql = "update ev_users set password=? where id=?"
        // 更新密码
        db.query(updatePwdSql, [password, req.user.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc("update password faile")
            return res.send({ status: 0, msg: "密码更新成功" })
        })
    })
}