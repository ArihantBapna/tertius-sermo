var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser')

var cors = require('cors');
var http = require('http');

var answerModel = require('./models/answers');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var setsRouter = require('./routes/sets');
var trainRouter = require('./routes/train');


var mongoose = require('mongoose');
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}
mongoose.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

//Change during production edition
var server = http.createServer(app);
var io = require('socket.io')(server, {
  cors:{
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"]
  }
});

//Initialize server for socket instance
server.listen('5000', () => {
  console.log('Socket Server is running on port 5000')
})


//Socket.io controller (use in modules when setup)
io.on('connection', (socket) => {
  socket.on('searchQuery', async (search) => {
    console.log(search);
    var answers = await answerModel.find({ANSWER: new RegExp(search, 'i')}).limit(100).sort({FREQUENCY: -1});
    socket.emit('found_answers', answers);
  });
});

//Sessions
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));


//Defined express routes
app.use('/', indexRouter);
app.use('/sets', setsRouter);
app.use('/users', usersRouter);
app.use('/train', trainRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('pages/error');
});

module.exports = app;

