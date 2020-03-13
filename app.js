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
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.user = helpers.getUser(req)
  next()
})
app.use('/upload', express.static(__dirname + '/upload'))

http.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app, passport)


// 加入線上人數計數
let onlineCount = 0;
// 修改 connection 事件
io.on('connection', (socket) => {
    // 有連線發生時增加人數
    onlineCount++;
    // 發送人數給網頁
    io.emit("online", onlineCount);
 
    socket.on("greet", () => {
      socket.emit("greet", onlineCount);
    });
    socket.on('send', msg => {
      if (Object.keys(msg).length < 2) return;
      io.emit('msg', msg)
    });
    socket.on('disconnect', () => {
        // 有人離線了，扣人
        onlineCount = (onlineCount < 0) ? 0 : onlineCount-=1;
        io.emit("online", onlineCount);
    });
});
