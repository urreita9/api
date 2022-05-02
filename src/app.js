const express = require('express');
const mercadopago = require('mercadopago');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/index.js');
const http = require('http');
const socketio = require('socket.io');
const { Server } = require('socket.io');
const Sockets = require('./routes/sockets.js');

require('./db.js');
//cambio para commitear a heroku
const server = express();
const ioserver = http.createServer(server);
const io = new Server(ioserver);

server.name = 'API';
server.use(cors());
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));
server.use((req, res, next) => {
    // res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//RUTAS REST
server.use('/api', routes);


//RUTAS SOCKET
const socket = new Sockets(io);

// Error catching endware.
server.use((err, req, res, next) => {
    // eslint-disable-line no-unused-vars
    const status = err.status || 500;
    const message = err.message || err;
    console.error(err);
    res.status(status).send(message);
});

module.exports = ioserver;
