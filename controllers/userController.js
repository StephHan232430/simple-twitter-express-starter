const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const TweetCategory = db.TweetCategory
const Category = db.Category
const multer = require('multer')
const upload = multer({
  dest: 'temp/'
})
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
    req.session.username = helpers.getUser(req).name
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
        {
          model: Tweet,
          include: [
            User,
            Reply,
            Like,
            { model: TweetCategory, include: [Category] }
          ]
        },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Tweet, as: 'LikedTweets' }
      ],
      order: [[{ model: Tweet }, 'createdAt', 'DESC']]
    }).then(user => {
      const isFollowed = helpers
        .getUser(req)
        .Followings.map(d => d.id)
        .includes(user.id)
      const tweets = user.Tweets.map(tweet => ({
        ...tweet.dataValues,
        isLiked: helpers.getUser(req).LikedTweets
          ? helpers
              .getUser(req)
              .LikedTweets.map(d => d.id)
              .includes(tweet.id)
          : helpers.getUser(req).LikedTweets
      }))
      res.render('profile', { profile: user, tweets, isFollowed })
    })
  },
  addFollowing: (req, res) => {
    if (helpers.getUser(req).id === Number(req.body.id)) {
      return res.send('can not follow self')
    }
    return Followship.create({
      followerId: helpers.getUser(req).id,
      followingId: Number(req.body.id)
    }).then(followship => {
      res.redirect('back')
    })
  },
  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.followingId
      }
    }).then(followship => {
      followship.destroy().then(followship => {
        return res.redirect('back')
      })
    })
  },
  editUser: (req, res) => {
    if (Number(req.params.id) !== helpers.getUser(req).id) {
      req.flash('error_msg', '無權編輯')
      return res.redirect(`/users/${req.params.id}/tweets`)
    }
    return User.findByPk(req.params.id, { raw: true }).then(user => {
      return res.render('edit', { user })
    })
  },
  putUser: (req, res) => {
    if (Number(req.params.id) !== Number(helpers.getUser(req).id)) {
      req.flash('error_msg', '無權編輯')
      return res.redirect(`/users/${req.params.id}/tweets`)
    }
    if (!req.body.name) {
      req.flash('error_msg', "Name didn't exist")
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
              avatar: file ? img.data.link : user.avatar
            })
            .then(user => {
              req.flash('success_msg', 'user was successfully to update')
              res.redirect(`/users/${req.params.id}/tweets`)
            })
        })
      })
    } else
      return User.findByPk(req.params.id).then(user => {
        user
          .update({
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: user.avatar
          })
          .then(user => {
            req.flash(
              'success_msg',
              `${user.name}'s profile was successfully to update`
            )
            res.redirect(`/users/${req.params.id}/tweets`)
          })
      })
  },
  getFollower: (req, res) => {
    User.findByPk(req.params.id, {
      include: [
        { model: Tweet, include: [User] },
        {
          model: User,
          as: 'Followers',
          include: [{ model: User, as: 'Followers' }]
        },
        { model: User, as: 'Followings' },
        { model: Tweet, as: 'LikedTweets' }
      ]
    }).then(user => {
      const isFollowed = helpers
        .getUser(req)
        .Followings.map(d => d.id)
        .includes(user.id)
      const followerList = user.Followers.map(r => ({
        ...r.dataValues,
        introduction: r.dataValues.introduction,
        isFollowed: helpers
          .getUser(req)
          .Followings.map(d => d.id)
          .includes(r.id)
      })).sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
      return res.render(
        'follower',
        JSON.parse(
          JSON.stringify({
            profile: user,
            isFollowed,
            followerList
          })
        )
      )
    })
  },
  getFollowing: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Tweet, include: [User] },
        { model: User, as: 'Followers' },
        {
          model: User,
          as: 'Followings',
          include: [{ model: User, as: 'Followers' }]
        },
        { model: Tweet, as: 'LikedTweets' }
      ]
    }).then(user => {
      const isFollowed = helpers
        .getUser(req)
        .Followings.map(d => d.id)
        .includes(user.id)
      const followingList = user.Followings.map(r => ({
        ...r.dataValues,
        introduction: r.dataValues.introduction
      })).sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
      return res.render(
        'following',
        JSON.parse(
          JSON.stringify({
            profile: user,
            isFollowed,
            followingList
          })
        )
      )
    })
  },
  getLike: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        {
          model: Tweet,
          as: 'LikedTweets',
          include: [
            User,
            Reply,
            Like,
            { model: TweetCategory, include: [Category] }
          ]
        }
      ],
      order: [[{ model: Tweet, as: 'LikedTweets' }, Like, 'createdAt', 'DESC']]
    }).then(user => {
      const isFollowed = helpers
        .getUser(req)
        .Followings.map(d => d.id)
        .includes(user.id)
      const LikedTweetList = user.LikedTweets.map(tweet => ({
        ...tweet.dataValues,
        isLiked: helpers.getUser(req).LikedTweets
          ? helpers
              .getUser(req)
              .LikedTweets.map(d => d.id)
              .includes(tweet.id)
          : helpers.getUser(req).LikedTweets
      }))
      return res.render(
        'like',
        JSON.parse(
          JSON.stringify({
            profile: user,
            isFollowed,
            LikedTweetList
          })
        )
      )
    })
  }
}

module.exports = userController
