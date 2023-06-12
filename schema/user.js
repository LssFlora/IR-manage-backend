const joi = require('joi');

const userName = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()
const role = joi.string().required()
const captcha = joi.required()

const id = joi.number().integer().min(1).required()
const nikiname = joi.string().required()
const email = joi.string().email().required()
exports.code_schema = {
    body: {
        captcha
    }
}
exports.login_schema = {
    body: {
        userName,
        password,
        captcha
    }
}
exports.reg_schema = {
    body: {
        userName,
        password,
        role
    }
}

exports.update_user_schema = {
    body: {
        nikiname,
        email
    }
}

exports.updatePwd_schema = {
    body: {
        oldPwd: password,
        newPwd: joi.not(joi.ref("oldPwd")).concat(password)
    }
}