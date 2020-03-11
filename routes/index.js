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

  
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  
  app.get('/logout', userController.logout)
  
  app.get('/', (req, res) => res.redirect('/tweets'))
  
  app.get('/tweets', authenticated, tweetController.getTweets)
  
  app.post('/tweets', authenticated, tweetController.postTweets)

  app.post('/tweets/:id/like', authenticated, tweetController.addLike)
  app.post('/tweets/:id/unlike', authenticated, tweetController.removeLike)

  app.post('/followships', authenticated, userController.addFollowing)
  app.delete(
    '/followships/:follwingId',
    authenticated, userController.removeFollowing
  )
}
