'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define(
    'Tweet',
    {
      UserId: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      location: DataTypes.STRING,
      url: DataTypes.STRING
    },
    {}
  )
  Tweet.associate = function(models) {
    // eslint-disable-line
    Tweet.belongsTo(models.User)
    Tweet.hasMany(models.Reply)
    Tweet.hasMany(models.Like)
    Tweet.hasMany(models.TweetCategory)

    Tweet.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'TweetId',
      as: 'LikedUsers'
    })
  }
  return Tweet
}
