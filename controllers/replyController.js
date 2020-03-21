const helpers = require('../_helpers')
const db = require('../models')
const Reply = db.Reply
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const TweetCategory = db.TweetCategory
const Category = db.Category

const replyController = {
  getReplies: (req, res) => {
    Tweet.findByPk(req.params.tweet_id, {
      include: [
        User,
        Like,
        { model: User, as: 'LikedUsers' },
        { model: Reply, include: [User] },
        { model: TweetCategory, include: [Category] }
      ]
    }).then(tweet => {
      tweet.dataValues.LikesCount = tweet.Likes.length
      tweet.dataValues.isLiked = tweet.LikedUsers.map(d => d.id).includes(
        helpers.getUser(req).id
      )
      tweet.Replies = tweet.Replies.sort((a, b) => b.createdAt - a.createdAt)
      User.findByPk(tweet.UserId, {
        include: [
          { model: Tweet, include: [User, Reply, Like] },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: Tweet, as: 'LikedTweets' }
        ]
      }).then(user => {
        const currentUserId = helpers.getUser(req).id

        user.dataValues.TweetsCount = user.Tweets.length
        user.dataValues.FollowerCount = user.Followers.length
        user.dataValues.FollowingCount = user.Followings.length
        user.dataValues.LikedTweetsCount = user.LikedTweets.length
        user.dataValues.isFollowed = helpers
          .getUser(req)
          .Followings.map(d => d.id)
          .includes(user.id)
        user.id === helpers.getUser(req).id
          ? (user.dataValues.isLogged = true)
          : (user.dataValues.isLogged = false)

        return res.render('tweetReplies', {
          tweet: JSON.parse(JSON.stringify(tweet)),
          targetUser: JSON.parse(JSON.stringify(user)),
          currentUserId
        })
      })
    })
  },
  // 與ＴＡ討論後，暫時這樣寫，待通知
  postReply: (req, res) => {
    if (req.headers.accept.includes('application/json')) {
      return Reply.create({
        comment: req.body.text,
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweet_id
      }).then(reply => {
        res.redirect(`/tweets/${req.params.tweet_id}/replies`)
      })
    } else if (req.body.text && req.body.text.trim().length !== 0) {
      return Reply.create({
        comment: req.body.text.trim(),
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweet_id
      }).then(reply => {
        res.redirect(`/tweets/${req.params.tweet_id}/replies`)
      })
    } else if (!req.body.text || req.body.text.trim().length === 0) {
      req.flash('error_msg', '輸入不可為空白')
      res.redirect(`/tweets/${req.params.tweet_id}/replies`)
    }
  }
}

module.exports = replyController
