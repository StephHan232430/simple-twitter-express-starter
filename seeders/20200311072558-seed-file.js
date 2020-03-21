'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert(
      'Users',
      [
        {
          email: 'root@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'root',
          avatar: 'https://loremflickr.com/200/200',
          introduction: faker.lorem.text(),
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'user1@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'user1',
          avatar: 'https://loremflickr.com/200/200',
          introduction: faker.lorem.text(),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'user2@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'user2',
          avatar: 'https://loremflickr.com/200/200',
          introduction: faker.lorem.text(),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )

    queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 50 }).map(d => ({
        description: faker.lorem.text(),
        // UserId: Math.floor(Math.random() * 3) + 1,
        // for heroku
        UserId: Math.floor(Math.random() * 3) * 10 + 2,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )

    return queryInterface.bulkInsert(
      'Replies',
      Array.from({ length: 200 }).map(d => ({
        comment: faker.lorem.text(),
        // UserId: Math.floor(Math.random() * 3) + 1,
        // TweetId: Math.floor(Math.random() * 50) + 1,
        // for heroku
        UserId: Math.floor(Math.random() * 3) * 10 + 2,
        TweetId: Math.floor(Math.random() * 50) * 10 + 2,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {})
    queryInterface.bulkDelete('Tweets', null, {})
    return queryInterface.bulkDelete('Replies', null, {})
  }
}
