var createError = require('http-errors');
var express = require('express');
var debug = require('debug')('tertius-sermo:server');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');
var sessionStore = session.MemoryStore();

var bodyParser = require('body-parser')

var cors = require('cors');
var http = require('http');

//Mongoose Models
var answerModel = require('./models/answers');
var clusterModel = require('./models/clusterClues');
var cluesModel = require('./models/allClues');
var userModel = require('./models/users');

//Express routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var setsRouter = require('./routes/sets');
var trainRouter = require('./routes/train');



//Initialize mongoose models
var mongoose = require('mongoose');
const sharedsession = require("express-socket.io-session");
const cookie = require("cookie");
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}
//Connect to atlas
mongoose.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Basic express init
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//CORS can be removed now, (added it during a dual server boot setup)
app.use(cors());

//Express sessions initialization: Note: add secret key to 'secret'.
var session = require('express-session')({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  store: sessionStore
})

app.use(session);

//Use defined express routes
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

// Set port to normalize
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);


//Init server
var server = http.createServer(app);
var io;

//Create socket io element
if(process.env.NODE_ENV === 'production'){
  io = require('socket.io')(server, {
    cors:{
      origin: 'https://tertius-sermo-web.herokuapp.com:'+(process.env.PORT || 3000),
      methods: ["GET", "POST"]
    },
    transports: ['polling']
  });
}else{
  io = require('socket.io')(server, {
    cors:{
      origin: 'http://localhost:3000',
      methods: ["GET", "POST"]
    },
    transports: ['polling']
  });
}
io.listen(server);

//Enable shared session variables between express and socket
io.use(sharedsession(session, {autosave: true}));

//Socket io handshake
io.use(function (socket, next){
  var handshake = socket.handshake;
  var cookies = handshake.headers.cookie;
  var parseCookie = cookie.parse(cookies);

  //Validate socket requests (I'm looking at you web crawlers)
  var sess = cookieParser.signedCookie(parseCookie['connect.sid'],'secret');

  if(sess === parseCookie['connect.sid']){
    next(new Error('Cannot validate request'));
  }else{
    next();
  }

});

//Socket.io controller (use in modules when setup)
io.on('connection', (socket) => {

  socket.on('searchQuery', async (search) => {
    //Responds with answer lines for the selectAnswer tables within editSets & createSets
    var answers = await answerModel.find({ANSWER: new RegExp(search, 'i')}).limit(100).sort({FREQUENCY: -1});
    socket.emit('found_answers', answers);
  });

  //When someone marks the clue as seen
  socket.on('markClue', async (clue) => {
    var chosenSet = socket.handshake.session.chosenSet;
    for(var ans of chosenSet.selectAnswers){
      if(ans.ID == clue.ANSWER_ID){
        var ind = ans.CLUES_LOADED.indexOf(clue.CLUE_ID);
        if(ind > -1){
          ans.CLUES_LOADED.splice(ind, 1);
          ans.CLUES_SEEN.push(clue.CLUE_ID);
        }
      }
    }
    socket.handshake.session.chosenSet = chosenSet;
  });

  //When someone moves backwards
  socket.on('backClue', async (clue) => {
    var chosenSet = socket.handshake.session.chosenSet;
    for(var ans of chosenSet.selectAnswers){
      if(ans.ID == clue.ANSWER_ID){
        var ind = ans.CLUES_SEEN.indexOf(clue.CLUE_ID);
        if(ind > -1){
          ans.CLUES_SEEN.splice(ind, 1);
          ans.CLUES_LOADED.push(clue.CLUE_ID);
        }
      }
    }
    socket.handshake.session.chosenSet = chosenSet;
  })

  //Saving sets to MongoDB
  socket.on('saveSet', async () => {
    var chosenSet = socket.handshake.session.chosenSet;
    var allSets = JSON.parse(socket.handshake.session.sets);

    var saveIndex = allSets.findIndex(i => i.id === chosenSet.id);
    allSets[saveIndex] = chosenSet;

    var count = 1;
    allSets.forEach(p => {
      p.id = count;
      count++;
    });

    var query = {'username': socket.handshake.session.username};
    var result = await userModel.updateOne(query, {sets: JSON.stringify(allSets)});

    //Set the session sets to allSets
    socket.handshake.session.sets = JSON.stringify(allSets);
    socket.handshake.session.chosenSet = chosenSet;

    socket.emit('savedSuccess');

  });

});


/*
 * Background server tasks
 */

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

