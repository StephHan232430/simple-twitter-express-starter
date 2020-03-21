const helpers = require('../_helpers')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const adminController = require('../controllers/adminController')
const replyController = require('../controllers/replyController')
const categoryController = require('../controllers/categoryController')
const passport = require('../config/passport')
const multer = require('multer')
const upload = multer({
  dest: 'temp/'
})

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/signin')
  }

  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return next()
      }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  app.get('/', (req, res) => res.redirect('/tweets'))

  app.get('/tweets', authenticated, tweetController.getTweets)
  app.post('/tweets', authenticated, tweetController.postTweets)
  app.post('/tweets/:id/like', authenticated, tweetController.addLike)
  app.post('/tweets/:id/unlike', authenticated, tweetController.removeLike)
  app.get(
    '/tweets/:tweet_id/replies',
    authenticated,
    replyController.getReplies
  )
  app.post(
    '/tweets/:tweet_id/replies',
    authenticated,
    replyController.postReply
  )
  app.get('/tweets/:categoryId', authenticated, categoryController.getCategory)

  app.post('/followships', authenticated, userController.addFollowing)
  app.delete(
    '/followships/:followingId',
    authenticated,
    userController.removeFollowing
  )

  app.get('/users/:id/tweets', authenticated, userController.getUser)
  app.get('/users/:id/likes', authenticated, userController.getLike)
  app.get('/users/:id/followers', authenticated, userController.getFollower)
  app.get('/users/:id/followings', authenticated, userController.getFollowing)
  app.get('/users/:id/edit', authenticated, userController.editUser)
  app.post(
    '/users/:id/edit',
    authenticated,
    upload.single('avatar'),
    userController.putUser
  )

  app.get('/admin', (req, res) => {
    res.redirect('/admin/tweets')
  })

  app.get(
    '/admin/users',
    authenticated,
    authenticatedAdmin,
    adminController.getUsers
  )
  app.get(
    '/admin/tweets',
    authenticated,
    authenticatedAdmin,
    adminController.getTweets
  )
  app.delete(
    '/admin/tweets/:id',
    authenticated,
    authenticatedAdmin,
    adminController.deleteTweet
  )
  app.put(
    '/admin/users/:id',
    authenticated,
    authenticatedAdmin,
    adminController.setUser
  )

  app.get('/chat/:id', authenticated, (req, res) => {
    res.sendFile(process.cwd() + '/public/chat.html')
  })

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)
  app.post(
    '/signin',
    passport.authenticate('local', {
      failureRedirect: '/signin',
      failureFlash: true
    }),
    userController.signIn
  )

  app.get('/logout', userController.logout)
}
