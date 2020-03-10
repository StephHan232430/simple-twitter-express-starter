const userController = require('../controllers/userController.js')
module.exports = app => {
  app.get('/users/:id/tweets', userController.getUser)
}
