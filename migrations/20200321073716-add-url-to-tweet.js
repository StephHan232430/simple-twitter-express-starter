'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Tweet', 'url', {
      type: Sequelize.STRING
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Tweet', 'url')
  }
}
