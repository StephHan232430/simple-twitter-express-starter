const db = require('../models')
const helpers = require('../_helpers')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User
const Like = db.Like
const Category = db.Category
const TweetCategory = db.TweetCategory

const categoryController = {
  getCategory: (req, res) => {
    Category.findOne({
      where: { id: req.params.categoryId },
      include: [
        {
          model: TweetCategory,
          include: [
            {
              model: Tweet,
              include: [
                User,
                Reply,
                Like,
                { model: User, as: 'LikedUsers' },
                { model: TweetCategory, include: [Category] }
              ]
            }
          ]
        }
      ]
    }).then(data => {
      data.TweetCategories.map(i => {
        i.Tweet = {
          ...i.Tweet.dataValues,

          isLiked: i.Tweet.LikedUsers.map(d => d.id).includes(
            helpers.getUser(req).id
          ),
          likeCount: i.Tweet.LikedUsers.length,
          replyCount: i.Tweet.Replies.length
        }
        console.log(data.TweetCategories)
      })
      return res.render('category', {
        category: JSON.parse(JSON.stringify(data))
      })
    })
  }
}

module.exports = categoryController
