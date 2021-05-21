require('dotenv').config();
require('./strategies/discord');

const Express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const Store = require('connect-mongo')(session);
const moesif = require('moesif-nodejs');

const app = new Express();

(async () => {
    await mongoose.connect(process.env.mongo, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true
    })
})();

app.use(session({
    secret: 'ThinhNguyen2006',
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    resave: false,
    saveUninitialized: false,
    store: new Store({
        mongooseConnection: mongoose.connection
    })
}))

// Configuring the view engine of the server
app.set('view engine', 'ejs');

// Paths
app.set('views', path.join(__dirname, 'views'));
app.use(Express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

const moesifMiddleware = moesif({
    applicationId: 'eyJhcHAiOiIzNjU6NTE5IiwidmVyIjoiMi4wIiwib3JnIjoiNjkwOjQyNCIsImlhdCI6MTYxOTgyNzIwMH0.KEVCWB4UV3NevkJWdnQh04gl417rFJClKPucyN1gJzg',

    identifyUser: function (req, res) {
        return req.user ? req.user.id : undefined;
    },
});

app.use(moesifMiddleware);



module.exports = app;