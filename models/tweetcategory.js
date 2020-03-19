'use strict';
module.exports = (sequelize, DataTypes) => {
  const TweetCategory = sequelize.define('TweetCategory', {
    TweetId: DataTypes.INTEGER,
    CategoryId: DataTypes.INTEGER
  }, {});
  TweetCategory.associate = function(models) {
    TweetCategory.belongsTo(models.Tweet)
    TweetCategory.belongsTo(models.Category)
  };
  return TweetCategory;
};
