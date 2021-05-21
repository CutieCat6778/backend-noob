require('dotenv').config();
require('./strategies/discord');

const Express = require('express');
const socketIo = require('socket.io');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const Store = require('connect-mongo')(session);

const app = new Express();
const server = http.createServer(app);
const io = socketIo(server);

(async () => {
    await mongoose.connect(process.env.mongo, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true
    })

})();

// Configuring the view engine of the server
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

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

// Paths
app.set('views', path.join(__dirname, 'views'));
app.use(Express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

(async () => {
    await require('./handlers/routes')(app);
})();

// Configuring the Socket.io server
io.on('connection', async (socket) => {
    require('./handlers/socket_io_events')(socket).then(() => {
        console.log('New user has been connected to the server');
        socket.emit('client_request_location');
    })
})

module.exports = app;