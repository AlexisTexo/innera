var createError = require('http-errors');
var express = require('express');
const cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var chatRouter = require('./routes/chat');
var archetypesRouter = require('./routes/archetypes');
var testApplicationRouter = require('./routes/testaplication');

var app = express();

app.set('trust proxy', true);

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:8080',
  'https://theinnercode.net',
  'https://www.theinnercode.net',
  'http://66.175.236.238',
  'https://66.175.236.238',
  'https://104.219.41.220',
];

const domainRegex = /^https:\/\/([a-z0-9-]+\.)*theinnercode\.net$/i;

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || domainRegex.test(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS: ' + origin));
  },
  // 👉 IMPORTANTE: si NO usas cookies/sesión, ponlo en false
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ✅ MISMA config

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Servir archivos estáticos (PNG, etc.) desde /public
app.use(
  '/assets',
  express.static(path.join(__dirname, 'public'), {
    etag: true,
    lastModified: true,
    maxAge: '365d',
    immutable: true
  })
);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chat', chatRouter);
app.use('/archetypes', archetypesRouter);
app.use('/testusers', testApplicationRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
