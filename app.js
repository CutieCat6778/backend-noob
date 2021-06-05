require('dotenv').config();
require('./strategies/discord');

const Express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const Store = require('connect-mongo')(session);
const { graphqlHTTP } = require('express-graphql');

const RootSchema = require('./graphql/index.js');

const app = new Express();

(async () => {
    await mongoose.connect(process.env.mongo, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true
    })
})();

app.use(cors({
    origin: process.env.URL,
    credentials: true
}))

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
});

app.use(session({
    secret: process.env.SECRET_PASS,
    cookie: {
        maxAge: 60000 * 60 * 24,
        sameSite: "none"
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

app.use('/graphql', graphqlHTTP({
    graphiql: false,
    schema: RootSchema,
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.local) {
    const logger = require('morgan');
    app.use(logger('dev'));
}

module.exports = app;