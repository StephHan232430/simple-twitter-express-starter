const db = require('../models')
const helpers = require('../_helpers')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User
const Like = db.Like
const Category = db.Category

const tweetController = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        User,
        Reply,
        { model: User, as: 'LikedUsers' }
      ]
    }).then(tweets => {
      const data = tweets.map(tweet => ({
        ...tweet.dataValues,
        isLiked: tweet.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id),
        likeCount: tweet.LikedUsers.length,
        replyCount: tweet.Replies.length
      }))
      User.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [{ model: User, as: 'Followers' }]
      }).then(users => {
        //整理 users 資料
        users = users.map(user => ({
          ...user.dataValues,
          // 計算追蹤者人數
          followerCount: user.Followers.length,
          // 判斷目前登入使用者是否已追蹤該 User 物件
          isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
        }))
        // 依追蹤者人數排序清單
        users = users.sort((a, b) => b.followerCount - a.followerCount)
        return res.render(
          'tweets',
          JSON.parse(
            JSON.stringify({
              tweets: data,
              users: users
            })
          )
        )
      })
    })
  },
  postTweets: (req, res) => {
    if (req.body.description.trim() !== '' && req.body.description.length <= 140) {
      // 假如有 hashtag 的情況
      if (req.body.category.trim().replace('#', '') !== '') {
        Category.findOne({
          where: { name: req.body.category.replace('#', '') }
        }).then(category => {
          if (category === null) {
            // 假如此 hashtag 分類不存在，則新增此分類
            Category.create({
              name: req.body.category.replace('#', '')
            }).then(newcategory => {
              Tweet.create({
                description: req.body.description.trim(),
                UserId: helpers.getUser(req).id,
                CategoryId: newcategory.id
              }).then(tweet => {
                return res.redirect('/tweets')
              })
            })
          } else {
            // 假如此 hashtag 存在，則直接新增 tweet
            Tweet.create({
              description: req.body.description.trim(),
              UserId: helpers.getUser(req).id,
              CategoryId: category.id
            }).then(tweet => {
              return res.redirect('/tweets')
            })
          }
        })
      } else {
        // 假如沒有 hashtag 的情況
        Tweet.create({
          description: req.body.description.trim(),
          UserId: helpers.getUser(req).id
        }).then(tweet => {
          return res.redirect('/tweets')
        })
      }
    } else {
      req.flash('error_msg', '輸入不可為空白！')
      return res.redirect('/tweets')
    }
  },
  addLike: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id
    }).then(like => {
      return res.redirect('back')
    })
  },
  removeLike: (req, res) => {
    Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id
      }
    }).then(like => {
      like.destroy().then(tweet => {
        return res.redirect('back')
      })
    })
  }
}

module.exports = tweetController
