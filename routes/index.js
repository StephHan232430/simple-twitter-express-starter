const helpers = require('../_helpers')
const userController = require('../controllers/userController')
const passport = require('../config/passport')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/signin')
  }

  // 註冊
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  // 登入
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  // 登出
  app.get('/logout', userController.logout)

  // Like/Unlike
  app.post('/tweets/:id/like', authenticated, userController.addLike)
  app.post('/tweets/:id/unlike', authenticated, userController.removeLike)
}
