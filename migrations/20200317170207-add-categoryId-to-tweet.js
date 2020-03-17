'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Tweets', 'CategoryId', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
  },

  down: (queryInterface, Sequelize) => {
     return queryInterface.removeColumn('Tweets', 'CategoryId')
  }
};
