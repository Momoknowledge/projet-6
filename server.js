const http = require('http'); // importe le package http de node
const app = require('./app');

/**
 * renvoie un numéro de port valide
 * @param val
 * @param defaultValue
 * @returns {number|*}
 */
const normalizePort = (val, defaultValue) => {
    const port = parseInt(val, 10);
    return Number.isFinite(port) && port > 1023 && port < 65536 ? port : defaultValue;
};
/**
 *renvoie sur quel port il doit tourner
 * @type {number|*}
 */
const port = normalizePort(process.env.PORT, 3000);

/**
 * recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
 * @param error
 */
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const  server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pip' +
        'e ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

//app.set('port',process.env.PORT || 3000 );

server.listen(port);