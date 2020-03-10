const express = require('express')
const helpers = require('./_helpers')
const db = require('./models')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const app = express()
const port = 3000

app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'main' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.user = helpers.getUser(req)
  res.locals.isAuthenticated = helpers.ensureAuthenticated(req)
  next()
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app, passport)
