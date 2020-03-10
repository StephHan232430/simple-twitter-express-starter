const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.LiFollowship


const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    if (
      !name ||
      !email ||
      !password ||
      !passwordCheck
    ) {
      req.flash('error_msg', '所有欄位皆為必填！')
      return res.redirect('/signup')
    }

    if (passwordCheck !== password) {
      req.flash('error_msg', '密碼與確認密碼不符！')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email } }).then(user => {
        if (user) {
          req.flash('error_msg', '此信箱已被註冊過！')
          return res.redirect('/signup')
        } else {
          User.create({
            name,
            email,
            password: bcrypt.hashSync(
              password,
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
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_msg', '登入成功！')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('success_msg', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  // Like/Unlike
  addLike: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.tweetId
    }).then(tweet => {
      return res.redirect('back')
    })
  },
  removeLike: (req, res) => {
    Like.findOne({ where: {
      UserId: helpers.getUser(req).id,
      TweetId: req.params.tweetId
    } }).then(like => {
      like.destroy().then(tweet => {
        return res.redirect('back')
    },
  getUser: (req, res) => {
    User.findByPk(req.params.id, {
      include: [
        { model: Tweet, include: [User, Reply, Like] },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Tweet, as: 'LikedTweets' }
      ],
      order: [[Tweet, 'id', 'DESC']]
    }).then(user => {
      const tweets = user.Tweets.map(tweet => ({
        ...tweet.dataValues,
        isLiked: helpers
          .getUser(req)
          .LikedTweets.map(d => d.id)
          .include(user.id),
        isFollowed: helpers
          .getUser(req)
          .Followings.map(following => following.id)
          .includes(user.id)
      }))
      res.render('profile', {
        profile: user.get({ plain: true }),
        tweets
      })
    })
  }
}
module.exports = userController
