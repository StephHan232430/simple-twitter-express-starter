'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Tweets', 'location', {
      type: Sequelize.STRING
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Tweets', 'location')
  }
}
