const userController = require('../controllers/userController.js')
const passport = require('../config/passport')

module.exports = (app, passport) => {
  // 註冊
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  // 登入
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  // 登出
  app.get('/logout', userController.logout)
  
  app.get('/users/:id/tweets', userController.getUser)
}
