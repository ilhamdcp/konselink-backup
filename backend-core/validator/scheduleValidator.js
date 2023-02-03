const JoiBase = require('@hapi/joi');
const JoiDate = require('@hapi/joi-date');
const Joi = JoiBase.extend(JoiDate);

const validate = function (error) {
    if (error) {
        console.log("Schema validation failed on validate schedule request param, error: " +error);
        return false;
    }
    return true;
};

module.exports.validateKlienScheduleRequestParam = function (scheduleId) {
    return !isNaN(scheduleId);
};

module.exports.validateListPsikologScheduleParam = function (month, year) {
    let schema = Joi.object({
        month: Joi.number().integer().min(1).max(12).required(),
        year: Joi.number().integer().min(2019).required()
    })

    let error = schema.validate({month, year}).error;
    return validate(error);
};

module.exports.validateCreatePsiklogScheduleParams = function (startDate, endDate, workDays, sessionNum, startTime, interval) {
    let schema = Joi.object({
        startDate: Joi.date().format("D/M/YYYY").required(),
        endDate: Joi.date().format("D/M/YYYY").required(),
        workDays: Joi.array().items(Joi.number().integer()).required(),
        sessionNum: Joi.number().integer().required(),
        startTime: Joi.string().pattern(new RegExp('^\\d\\d:\\d\\d$')).required(),
        interval: Joi.number().integer().required()
    });

    if (typeof workDays === "string") {
        workDays = workDays.split(",");
    }
    let error = schema.validate({startDate, endDate, workDays, sessionNum, startTime, interval}).error;
    return validate(error);
};