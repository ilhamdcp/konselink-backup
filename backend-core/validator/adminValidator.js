const listValidator = require('../validator/listValidator');
const JoiBase = require('@hapi/joi');
const JoiDate = require('@hapi/joi-date');
const Joi = JoiBase.extend(JoiDate);

module.exports.validateAdminListParams = function (entrySize, pageNo, keyword, isVerified) {
    let params = listValidator.validateListParams(entrySize, pageNo, keyword);
    params.isVerified = isVerified === "true";
    return params;
};

module.exports.validateAdminDownloadDataParam = function (startDate, endDate) {
    let schema = Joi.object({
        startDate: Joi.date().format("D/M/YYYY").required(),
        endDate: Joi.date().format("D/M/YYYY").required(),
    });

    let error = schema.validate({startDate, endDate}).error;
    if (error !== undefined) {
        console.log("Schema validation failed on validate admin download data param, error: " +error);
        return false;
    }
    return true;
};