const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.LiFollowship

const helpers = require('../_helpers')

const userController = {
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
