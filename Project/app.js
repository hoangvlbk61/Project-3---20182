var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const mongoose = require('mongoose');
var logger = require('morgan');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var dashboardRouter = require('./routes/dashboard');
var vocabListSettingRoutes = require('./routes/vocablistsetting');

var memberManager = require('./routes/memberManager');
var testManager = require('./routes/testManager');
var vocabManager = require('./routes/vocabManager');

var forum = require('./routes/forum');

var profile = require('./routes/profile');

var checkin = require('./routes/diemdanh');
var kiemtratuvung = require('./routes/kiemtratuvung')

var app = express();


// Chuyển gói tin body về dạng json để đọc ghi 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Header access through browser 
app.use((req, res, next) => {
  res.header('Acess-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({})
  }
  next();
})

mongoose.connect('mongodb://localhost/englishWebsite', { useNewUrlParser: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));