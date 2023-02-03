const joi = require('@hapi/joi');

module.exports.validateChatParams = function (scheduleId, timestamp) {
    let schema = joi.object({
        scheduleId: joi.number().integer().required(),
        timestamp: joi.date().iso()
    });

    let error = schema.validate({ scheduleId, timestamp }).error;

    if (error !== undefined) {
        console.log("Error when validating chat params, err: " , error);
        return false;
    }
    return true;
};

module.exports.validateSurveyData = function (surveyData, scheduleId) {
    const surveySchema = joi.object({
        answerKey: joi.string().required(),
        answerValue: joi.number().integer().required()
    });

    const surveyDataSchema = joi.array().items(surveySchema);

    const scheduleIdSchema = joi.object({
        scheduleId: joi.number().integer().required()
    });

    let surveyDataError = surveyDataSchema.validate(surveyData).error;
    let scheduleIdError = scheduleIdSchema.validate({scheduleId}).error;

    return isSurveyParamValid(surveyDataError, scheduleIdError);
};

module.exports.validateRecordData = function (recordData) {
    let schema = joi.object({
        diagnosis: joi.string(),
        diagnosisCode: joi.number().integer(),
        physicalHealthHistory: joi.string(),
        medicalConsumption: joi.string(),
        suicideRisk: joi.string(),
        selfHarmRisk: joi.string(),
        othersHarmRisk: joi.string(),
        assessment: joi.string(),
        consultationPurpose: joi.string(),
        treatmentPlan: joi.string(),
        meetings: joi.number().integer(),
        notes: joi.string(),
        scheduleId: joi.number().integer().required(),
        problemDescription: joi.string()
    });

    let error = schema.validate(recordData).error;
    if (error === undefined) {
        return true;
    } else {
        console.log("Error when validating record data, error: " , error);
        return false;
    }
};

const isSurveyParamValid = function (surveyDataError, scheduleIdError) {
    if (scheduleIdError !== undefined || surveyDataError !== undefined) {
        console.log("Error when validating surveyDataParam, surveyDataError: " + surveyDataError +
                    ", scheduleIdError: " + scheduleIdError);
        return false;
    }
    return true;
};

module.exports.validateId = function (scheduleId) {
    return !isNaN(scheduleId);
};