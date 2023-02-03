const io = require('socket.io-client');
const tokenUtils = require('../utils/token');
const constant = require('../constant');

module.exports.sendNotification = function (payload) {
    const socket = io.connect(constant.KONSELINK_WS_URL, {
        query: {token: tokenUtils.generateToken(0)},
    });

    socket._connectTimer = setTimeout(function() {
        socket.close();
    }, constant.WS_CONNECT_TIMEOUT);

    socket.on('connect', function() {
        clearTimeout(socket._connectTimer);
        socket.emit('NOTIFICATION', payload);

        setTimeout(() => {
            socket.close();
        }, constant.WS_EMIT_TIMEOUT);
    });
};