const query = require('./database/query');
const tokenUtils = require('./utils/token');
const mapper = require('./utils/mapper');
const { CHAT, DASH, END_CHAT } = require('./constant');

module.exports.connection = function (socket) {
    let decodedToken = tokenUtils.verifyAndGetValueFromToken(socket.handshake.query);
    if (!decodedToken) {
        socket.disconnect();
    }
    socket.userId = decodedToken.userId;
    console.log("connected:", socket.userId);
}

module.exports.chat = function (socket, io) {
    return async function (payload) {
        try {
            console.log(payload);
            console.log("userId: ", socket.userId);
            let data = JSON.parse(payload);
            let { chatDbData, chatData } = mapper.mapChatData(data.message, data.scheduleId, socket.userId);
            await query.insertJSONData(chatDbData, "konselink_chat");

            let destinationSocket = CHAT + DASH + data.receiverId;
            console.log(destinationSocket);
            io.emit(destinationSocket, chatData);
        } catch (err) {
            console.log("error on chat, error:", err);
        }
    };
};

module.exports.notification = function (socket, io) {
    return function (payload) {
        try {
            let destinationSocket = payload.type + DASH + payload.receiverId;
            delete payload.type;
            delete payload.receiverId;
            console.log(destinationSocket);
            console.log(payload);
            io.emit(destinationSocket, payload);
        } catch (err) {
            console.log("error on notification, error:", err);
        }
    };
};

module.exports.endChat = function (socket, io) {
    return async function (payload) {
        try {
            let destinationSocket = END_CHAT + DASH + payload.receiverId;
            console.log(destinationSocket);
            console.log(payload);
            delete payload.receiverId;
            await query.updateDoneSchedule(payload.scheduleId);
            io.emit(destinationSocket, payload);
        } catch (err) {
            console.log("error on endChat, error:", err);
        }
    }
}