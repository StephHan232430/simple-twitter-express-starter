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
    Category.findOne({ where: { id: req.params.categoryId }}, {
      include: [
        { model: TweetCategory, include: [Tweet] }
      ]
    }).then(category => {
      return res.render(
        'category',
        JSON.parse(JSON.stringify({ category: category }))
      )
    })
  }
}

module.exports = categoryController
