const app = require('express')();
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log("listening on port: "+ PORT));
const io = require('socket.io')(server);
const handler = require('./handler');
const { CONNECTION, CHAT, NOTIFICATION, END_CHAT } = require('./constant');

io.on(CONNECTION, function (socket) {
    handler.connection(socket);

    socket.on(CHAT, handler.chat(socket, io));
    socket.on(NOTIFICATION, handler.notification(socket, io));
    socket.on(END_CHAT, handler.endChat(socket, io));
});