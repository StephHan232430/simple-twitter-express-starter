'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      avatar: {
        type: DataTypes.STRING,
        defaultValue:
          'https://lighthouse-cdn.alphacamp.co/default/medium_user_photo.jpg'
      },
      introduction: {
        type: DataTypes.TEXT,
        defaultValue: ''
      },
      role: DataTypes.STRING
    },
    {}
  )
  User.associate = function(models) {
    User.hasMany(models.Tweet)
    User.hasMany(models.Reply)
    User.hasMany(models.Like)

    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikedTweets'
    })
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    }) //User 的追蹤者
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    }) //User 追蹤中的 User
  }
  return User
}
