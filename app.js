var express = require('express');
var session = require('express-session')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var NodeCache = require('node-cache');
var configuration = require('./configuration');

var routes = require('./routes/index');
var admin = require('./routes/admin');

var manager = require('./lib/manager');

var api = require('./lib/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// mysql
manager.setDatabase(mysql.createPool({
    host     : configuration.mysql.host,
    port     : configuration.mysql.port,
    user     : configuration.mysql.user,
    password : configuration.mysql.password,
    database : configuration.mysql.database
}));
manager.setCache(new NodeCache({ stdTTL: 10 * 60 }));
manager.setStats(new NodeCache({ stdTTL: 1 * 60, checkperiod: 2 * 60 }));

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: configuration.server.sessionSecret,
    resave: false,
    saveUninitialized: true
}));

app.use(function(req, res, next) {
    if (req.url != '/favicon.ico') {
        var stat = manager.getStats().get(req.sessionID)[req.sessionID];
        if (stat == undefined) {
            stat = {};

            api.server.incrementVisitors(function() {});
        }
        stat.url = req.url;
        stat.date = new Date();
        manager.getStats().set(req.sessionID, stat);
    }

    next();
});

app.use('/', routes);
app.use('/a/', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
