module.exports = (app, io) => {
    console.log(app, io)

    io.on('connection', (socket) => {
        require('./socket_events')(socket).then(() => {
            console.log('New user has been connected to the server');
            socket.emit('client_request_location');
            socket_io = socket;
        })
    })
    
    app.use('/', require('../routes/-.js')(io));
    app.use('/api', require('../routes/-api.js')(io));
}