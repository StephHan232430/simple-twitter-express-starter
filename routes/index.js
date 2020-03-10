const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const passport = require('../config/passport')
const helpers = require('../_helpers')


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
  // 導向首頁
  app.get('/', (req, res) => res.redirect('/tweets'))
  // 首頁
  app.get('/tweets', authenticated, tweetController.getTweets)
  // 新增 Tweet
  app.post('/tweets', authenticated, tweetController.postTweets)

  // Like/Unlike
  app.post('/tweets/:id/like', authenticated, userController.addLike)
  app.delete('/tweets/:id/unlike', authenticated, userController.removeLike)

  //Follow/Unfollow
  app.post('/following/:id', authenticated, userController.addFollow)
  app.delete('/following/:id', authenticated, userController.removeFollow)
}
