const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship

const helpers = require('../_helpers')

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    if (!name || !email || !password || !passwordCheck) {
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
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
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
  getUser: (req, res) => {
    User.findByPk(req.params.id, {
      include: [
        { model: Tweet, include: [User, Reply, Like] },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Tweet, as: 'LikedTweets' }
      ]
    }).then(user => {
      const isFollowed = helpers
        .getUser(req)
        .Followings.map(following => following.id)
        .includes(user.id)
      const tweets = user.Tweets.map(tweet => ({
        ...tweet.dataValues,
        isLiked: helpers
          .getUser(req)
          .LikedTweets.map(d => d.id)
          .include(user.id)
      })).sort((a, b) => b.createdAt - a.createdAt)
      res.render('profile', {
        profile: user,
        tweets,
        isFollowed
      })
    })
  },
  addFollowing: (req, res) => {
    return Followship.create({
      followerId: helpers.getUser(req).id,
      followingId: req.body.userId
    }).then(followship => {
      return res.redirect('back')
    })
  },
  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.follwingId
      }
    }).then(followship => {
      followship.destroy().then(followship => {
        return res.redirect('back')
      })
    })
  },
  editUser: (req, res) => {
    if (Number(req.params.id) !== helpers.getUser(req).id) {
      return res.redirect('/')
    }
    User.findByPk(req.params.id, { raw: true }).then(user => {
      res.render('edit', { user })
    })
  },
  putUser: (req, res) => {
    if (Number(req.params.id) !== Number(req.user.id)) {
      return res.redirect(`/users/${req.params.id}`)
    }
    if (!req.user.name) {
      req.flash('error_messages', '姓名必填寫')
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id).then(user => {
          user
            .update({
              name: req.body.name,
              introduction: req.body.introduction,
              avatar: file ? img.data.link : user.image
            })
            .then(user => {
              req.flash(
                'success_messages',
                `${user.name}'s profile was successfully to update`
              )
              res.redirect(`/users/${req.params.id}`)
            })
        })
      })
    } else
      return User.findByPk(req.params.id).then(user => {
        user
          .update({
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: user.image
          })
          .then(user => {
            req.flash(
              'success_messages',
              `${user.name}'s profile was successfully to update`
            )
            res.redirect(`/users/${req.params.id}`)
          })
      })
  }
}
module.exports = userController
