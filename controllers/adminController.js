const db = require('../models')
const helpers = require('../_helpers')
const Reply = db.Reply
const User = db.User
const Tweet = db.Tweet

const adminController = {
  getUsers: (req, res) => {
    User.findAll({
      include: [
        { model: Tweet, include: [{ model: User, as: 'LikedUsers' }] },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    }).then(users => {
      // 登入中使用者不顯示權限變換選項
      let loggedUserId = helpers.getUser(req).id
      for (user of users) {
        if (user.id === loggedUserId) {
          user.dataValues.showLink = false
        } else {
          user.dataValues.showLink = true
        }
      }
      users = users.map(user => {
        var isAdmin = ''
        if (user.role === 'admin') {
          isAdmin = true
        } else {
          isAdmin = false
        }
        // 計算使用者推播被 like 的數量
        var likeCount = 0
        // 如果推播數量為零，則 like = 0
        if (!user.Tweets) {
          likeCount = 0
        } else {
          // 計算每則推播 like 數量並加總
          for (var index in user.Tweets) {
            likeCount += user.Tweets[index].LikedUsers.length
          }
        }
        return (user = {
          ...user.dataValues,
          likeCount: likeCount,
          isAdmin: isAdmin
        })
      })
      users = users.sort((a, b) => b.Tweets.length - a.Tweets.length)
      return res.render(
        'admin/users',
        JSON.parse(JSON.stringify({ users: users }))
      )
    })
  },
  getTweets: (req, res) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [User, Reply]
    }).then(tweets => {
      tweets = tweets.map(tweet => ({
        ...tweet.dataValues,
        description: tweet.description
      }))
      return res.render(
        'admin/tweets',
        JSON.parse(
          JSON.stringify({
            tweets: tweets
          })
        )
      )
    })
  },
  deleteTweet: (req, res) => {
    Tweet.findByPk(req.params.id).then(tweet => {
      tweet.destroy().then(tweet => {
        Reply.findAll({ where: { TweetId: req.params.id }}).then(replies => {
          replies.map(d => {
            d.destroy()
          })
          return res.redirect('back')
        })
      })
    })
  },
  setUser: (req, res) => {
    User.findByPk(req.params.id).then(user => {
      if (user.role === 'user') {
        user
          .update({
            role: 'admin'
          })
          .then(user => {
            req.flash('success_messages', 'user was successfully to update')
            res.redirect('/admin/users')
          })
      } else {
        user
          .update({
            role: 'user'
          })
          .then(user => {
            req.flash('success_messages', 'user was successfully to update')
            res.redirect('/admin/users')
          })
      }
    })
  }
}

module.exports = adminController
