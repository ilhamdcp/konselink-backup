const dateFormat = require('dateformat');

const getFormattedDate = function(date) {
    let dates = date.split("/");
    try {
        return dates[1] + "/" + dates[0] + "/" + dates[2];
    } catch (err) {
        console.log(err);
        return 0;
    }
};

module.exports.getMonthFromDateObject = function (date) {
    return date.getMonth() + 1; // 1 = January
};

module.exports.getYearFromDateObject = function (date) {
    return date.getFullYear(); 
};

module.exports.getDateObjectFromDateAndTimeString = function (dateStr, timeStr) {
    let dateObject = new Date(getFormattedDate(dateStr));
    let hoursAndMinutes = timeStr.split(":");
    dateObject.setHours(hoursAndMinutes[0], hoursAndMinutes[1], 0, 0);
    return dateObject;
}

module.exports.getDateStringFromDateObject = function (date) {
    let format = "d/m/yyyy";
    return dateFormat(date, format);
};

module.exports.getTimeStringFromDateObject = function (date) {
    let format = "HH:MM";
    return dateFormat(date, format);
};