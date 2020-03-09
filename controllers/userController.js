const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    if (
      !req.body.name ||
      !req.body.email ||
      !req.body.password ||
      !req.body.passwordCheck
    ) {
      req.flash('error_msg', '所有欄位皆為必填！')
      return res.redirect('/signup')
    }

    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_msg', '密碼與確認密碼不符！')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_msg', '此信箱已被註冊過！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10),
              null
            )
          }).then(user => {
            req.flash('success_msg', '帳號註冊成功，請登入！')
            return res.redirect('/signin')
          })
        }
      })
    }
  }
}

module.exports = userController
