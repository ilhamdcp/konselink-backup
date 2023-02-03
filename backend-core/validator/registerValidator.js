const Joi = require('@hapi/joi');
const constant = require('../constant');

const klienSchema = Joi.object({
    address: Joi.string(),
    birthDay: Joi.number().integer(),
    birthMonth: Joi.number().integer(),
    birthPlace: Joi.string(),
    birthYear: Joi.number().integer(),
    collegeData: Joi.string(),
    complaint: Joi.string(),
    currentEducation: Joi.string(),
    effortDone: Joi.string(),
    elementaryData: Joi.string(),
    fatherAddress: Joi.string(),
    fatherAge: Joi.number().integer(),
    fatherEducation: Joi.string(),
    fatherName: Joi.string(),
    fatherOccupation: Joi.string(),
    fatherReligion: Joi.string(),
    fatherTribe: Joi.string(),
    gender: Joi.string(),
    hasConsultedBefore: Joi.boolean(),
    juniorData: Joi.string(),
    kindergartenData: Joi.string(),
    monthConsulted: Joi.number().integer(),
    motherAddress: Joi.string(),
    motherAge: Joi.number().integer(),
    motherEducation: Joi.string(),
    motherName: Joi.string(),
    motherOccupation: Joi.string(),
    motherReligion: Joi.string(),
    motherTribe: Joi.string(),
    name: Joi.string(),
    phoneNumber: Joi.string(),
    placeConsulted: Joi.string(),
    problem: Joi.string(),
    religion: Joi.string(),
    seniorData: Joi.string(),
    solution: Joi.string(),
    sibling1Age: Joi.number().integer(),
    sibling1Education: Joi.string(),
    sibling1Gender: Joi.string(),
    sibling1Name: Joi.string(),
    sibling1Occupation: Joi.string(),
    sibling2Age: Joi.number().integer(),
    sibling2Education: Joi.string(),
    sibling2Gender: Joi.string(),
    sibling2Name: Joi.string(),
    sibling2Occupation: Joi.string(),
    sibling3Age: Joi.number().integer(),
    sibling3Education: Joi.string(),
    sibling3Gender: Joi.string(),
    sibling3Name: Joi.string(),
    sibling3Occupation: Joi.string(),
    sibling4Age: Joi.number().integer(),
    sibling4Education: Joi.string(),
    sibling4Gender: Joi.string(),
    sibling4Name: Joi.string(),
    sibling4Occupation: Joi.string(),
    sibling5Age: Joi.number().integer(),
    sibling5Education: Joi.string(),
    sibling5Gender: Joi.string(),
    sibling5Occupation: Joi.string(),
    sibling5Name: Joi.string(),
    yearConsulted: Joi.number().integer()
});

const psikologSchema = Joi.object({
    fullname: Joi.string(),
    specialization: Joi.string(),
    gender: Joi.string(),
    sipNumber: Joi.string(),
    strNumber: Joi.string(),
    sspNumber: Joi.string()
});

const validate = function(error) {
    if (error !== undefined) {
        console.log("Schema validation failed on validate registration data, error: " , error);
        return false;
    }
    return true;
};

module.exports.validateKlienData = function (data) {
    let error = klienSchema.validate(data).error;
    return validate(error);
};

module.exports.validatePsikologData = function (data) {
    let error = psikologSchema.validate(data).error;
    return validate(error);
};

module.exports.validateSubmitSurveyData = function(surveyData) {
    const surveySchema = Joi.object({
        answerKey: Joi.string().required(),
        answerValue: Joi.number().integer().required()
    });

    const surveyDataSchema = Joi.array().items(surveySchema).required();

    let ipipDataError = surveyDataSchema.validate(surveyData.IPIP).error;
    let srqDataError = surveyDataSchema.validate(surveyData.SRQ).error;

    if (ipipDataError !== undefined || srqDataError !== undefined) {
        console.log("Error when validating submit survey data, ipipDataError: " + ipipDataError +
            " srqDataError: " + srqDataError);
        return false;
    }
    return true;
};

module.exports.validateGetSurveyParam = function (klienId, questionType) {
    const schema = Joi.object({
        klienId: Joi.number().integer().required(),
        questionType: Joi.any().valid(constant.questionType.SRQ, constant.questionType.IPIP).required()
    });

    let error = schema.validate({ klienId, questionType }).error;
    if (error !== undefined) {
        console.log("Error when validating get survey param, error: " , error);
        return false;
    }
    return true;
};

module.exports.validateId = function (id) {
    return !isNaN(id);
};