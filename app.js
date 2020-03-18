const express = require('express')
const helpers = require('./_helpers')
const db = require('./models')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const currentUser = {}
const port = process.env.PORT || 3000
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.engine(
  'hbs',
  exphbs({
    extname: 'hbs',
    defaultLayout: 'main',
    helpers: require('./config/handlebars-helpers')
  })
)
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const sessionMiddleware = session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
})

io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res, next)
})

app.use(sessionMiddleware)

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.user = helpers.getUser(req)
  next()
})
app.use('/upload', express.static(__dirname + '/upload'))
app.use(express.static('public'))

http.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app, passport)

io.on('connection', socket => {
  const currentUser = socket.request.session.username
  socket.emit('getCurrentUser', currentUser)

  socket.on('chatMessage', data => {
    io.emit('chatMessage', {
      message: data.message,
      sender: data.sender,
      receiver: currentUser
    })
  })

  socket.on('typing', data => {
    socket.broadcast.emit('typing', data)
  })

  socket.on('disconnect', () => {
    socket.disconnect(true)
  })
})

module.exports = app
