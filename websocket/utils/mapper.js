const { APPROVAL, REJECTION, REQUEST } = require('../constant');
const camelCaseKeys = require('camelcase-keys');

module.exports.mapChatData = function (message, scheduleId, userId) {
    let date = new Date();
    let chatDbData = {
        schedule_id: scheduleId,
        message: message,
        sender_id: userId,
        timestamp: date.toISOString()
    }
    let chatData = camelCaseKeys(chatDbData);
    return { chatDbData, chatData };
};

module.exports.mapNotificationData = function (type, senderId, scheduleId) {
    let data = { scheduleId };
    if (type === APPROVAL || type === REJECTION) {
        data.counselorId = senderId;
    } else if (type === REQUEST) {
        data.clientId = senderId;
    }
    return data;
};