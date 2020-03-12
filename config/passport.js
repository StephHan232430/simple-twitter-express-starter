const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, email, password, cb) => {
      User.findOne({ where: { email } }).then(user => {
        if (!user) return cb(null, false, req.flash('error_msg', '無此帳號！'))
        if (!bcrypt.compareSync(password, user.password))
          return cb(null, false, req.flash('error_msg', '密碼錯誤！'))
        return cb(null, user)
      })
    }
  )
)

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
      { model: Tweet, as: 'LikedTweets' }
    ]
  }).then(user => {
    return cb(null, user)
  })
})

module.exports = passport
