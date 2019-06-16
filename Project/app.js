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
var dashboardRouter=require('./routes/dashboard');
var vocabListSettingRoutes = require('./routes/vocablistsetting');

var memberManager = require('./routes/memberManager');
var testManager = require('./routes/testManager');
var vocabManager = require('./routes/vocabManager');

var forum = require('./routes/forum');

var profile = require('./routes/profile');

var checkin = require('./routes/checkin');

var app = express();


// Chuyển gói tin body về dạng json để đọc ghi 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Header access through browser 
app.use((req, res, next) => {
    res.header('Acess-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers',
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === "OPTIONS") { 
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); 
        return res.status(200).json({})
    }
    next() ;
})

mongoose.connect('mongodb://localhost/englishWebsite',{ useNewUrlParser: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ........Them de hien giao dien
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use('/static',express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use('/vendor', express.static('/vendor'));
app.use('/build', express.static('/build'));
app.use('/stylesheets', express.static('/stylesheets'));
app.use('/img', express.static('/img'));
app.use('/images', express.static('/images'));
// app.use('/ImagesProduct', express.static('/ImagesProduct'));


app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/dashboard',dashboardRouter);
app.use('/thietlapdanhsachhoc', vocabListSettingRoutes);

app.use('/quanlythanhvien', memberManager);
app.use('/quanlytuvung', vocabManager);
app.use('/quanlydethi', testManager);
app.use('/forum', forum) ; 
app.use('/profile', profile);

app.use('/checkin', checkin);
// var memberManager = require('./routes/memberManager');
// app.use('/quanlythanhvien', memberManager);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // res.status(err.status || 500);
  res.render('page_404');
});

  

module.exports = app;
