const query = require('../../database/query');
const constant = require('../../constant');
const tokenUtils = require('../../utils/token');
const Joi = require('@hapi/joi');

let userTesting = require('./data/user-testing.json');
let psikologData = require('./data/psikolog-data-database.json');
let psikologScheduleWithKlienId = require('./data/psikolog-schedule-with-klien-id.json');
let psikologSchedule = require('./data/psikolog-schedule.json');
let chatData = require('./data/chat-data.json');
let surveyData = require('./data/preconsultation-survey.json');
let recordData = require('./data/klien-record.json');
let registrationSurveyData = require('./data/registration-survey-database.json');
let { klienData, klienParentsData, klienSiblingsData } = require('./data/klien-data-database.json');

module.exports.userTesting = userTesting;
module.exports.ssoLogin = require('./data/sso-login-data.json');

module.exports.insertUserTesting = async function () {
    await query.insertJSONData(userTesting, constant.table.KONSELINK_USER);
}

module.exports.insertPsikologData = async function () {
    await query.insertJSONData(psikologData, constant.table.PSIKOLOG_DATA);
}

module.exports.insertPsikologScheduleWithKlienId = async function() {
    let date = new Date();
    date.setHours(date.getHours()+1, date.getMinutes(), 0,0);
    psikologScheduleWithKlienId.start_times = date.toISOString();
    date.setHours(date.getHours()+1, date.getMinutes()+30, 0,0);
    psikologScheduleWithKlienId.end_times = date.toISOString();
    await query.insertJSONData(psikologScheduleWithKlienId, constant.table.PSIKOLOG_SCHEDULE);
}

module.exports.insertOngoingSchedule = async function() {
    let startTimestamp = new Date();
    let endTimestamp = new Date();
    startTimestamp.setHours(startTimestamp.getHours(), startTimestamp.getMinutes()-10, 0, 0);
    endTimestamp.setHours(endTimestamp.getHours(), endTimestamp.getMinutes()+10, 0, 0);
    psikologScheduleWithKlienId.start_times = startTimestamp.toISOString() + "+7:00";
    psikologScheduleWithKlienId.end_times = endTimestamp.toISOString() + "+7:00";
    psikologScheduleWithKlienId.is_approved = true;
    await query.insertJSONData(psikologScheduleWithKlienId, constant.table.PSIKOLOG_SCHEDULE);
};

module.exports.insertUpcomingSchedule = async function() {
    let startTimestamp = new Date();
    let endTimestamp = new Date();
    startTimestamp.setHours(startTimestamp.getHours(), startTimestamp.getMinutes()+20, 0, 0);
    endTimestamp.setHours(endTimestamp.getHours(), endTimestamp.getMinutes()+40, 0, 0);
    psikologScheduleWithKlienId.start_times = startTimestamp.toISOString() + "+7:00";
    psikologScheduleWithKlienId.end_times = endTimestamp.toISOString() + "+7:00";
    psikologScheduleWithKlienId.is_approved = true;
    await query.insertJSONData(psikologScheduleWithKlienId, constant.table.PSIKOLOG_SCHEDULE);
};

module.exports.deleteUserTesting = async function () {
    await query.deleteUserByUsernameAndLoginType(userTesting.username, userTesting.login_type);
};

module.exports.insertPsikologSchedule = async function () {
    let date = new Date();
    date.setHours(date.getHours()+1, date.getMinutes(), 0,0);
    psikologSchedule.start_times = date.toISOString();
    date.setHours(date.getHours()+1, date.getMinutes()+30, 0,0);
    psikologSchedule.end_times = date.toISOString();
    await query.insertJSONData(psikologSchedule, constant.table.PSIKOLOG_SCHEDULE);
};

module.exports.insertApprovedPsikologSchedule = async function () {
    let date = new Date();
    psikologSchedule.is_approved = true;
    date.setHours(date.getHours()+1, date.getMinutes(), 0,0);
    psikologSchedule.start_times = date.toISOString();
    date.setHours(date.getHours()+1, date.getMinutes()+30, 0,0);
    psikologSchedule.end_times = date.toISOString();
    await query.insertJSONData(psikologSchedule, constant.table.PSIKOLOG_SCHEDULE);
}

module.exports.insertEmptyKlienData = async function () {
    let emptyKlienData = {
        user_id: 10
    }
    await query.insertJSONData(emptyKlienData, constant.table.KLIEN_DATA);
};

module.exports.insertEmptyPsikologData = async function () {
    let emptyPsikologData = {
        user_id: 10
    }
    await query.insertJSONData(emptyPsikologData, constant.table.PSIKOLOG_DATA);
};

module.exports.insertChatHistoryData = async function () {
    let date = new Date();
    date.setHours(date.getHours() - 1);
    chatData.timestamp = date.toISOString();
    await query.insertJSONData(chatData, constant.table.KONSELINK_CHAT);
};

module.exports.generateToken = function (userId) {
    return tokenUtils.generateToken(userId);
};

module.exports.insertPreconsultationSurvey = async function () {
    await query.insertJSONData(surveyData[0], constant.table.PRECONSULTATION_SURVEY);
    await query.insertJSONData(surveyData[1], constant.table.PRECONSULTATION_SURVEY);
};

module.exports.insertKlienRecord = async function () {
    await query.insertJSONData(recordData, constant.table.KLIEN_RECORD);
};

module.exports.insertRegistrationSurvey = async function () {
    for (let data of registrationSurveyData) {
        await query.insertJSONData(data, constant.table.REGISTRATION_SURVEY);
    }
};

module.exports.insertKlienData = async function () {
    await query.insertJSONData(klienData, constant.table.KLIEN_DATA);
    await query.insertJSONData(klienParentsData[0], constant.table.KLIEN_PARENTS_DATA);
    await query.insertJSONData(klienParentsData[1], constant.table.KLIEN_PARENTS_DATA);
    await query.insertJSONData(klienSiblingsData, constant.table.KLIEN_SIBLINGS_DATA);
};

module.exports.verifyGetKlienData = function (klienData) {
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
        yearConsulted: Joi.number().integer(),
        collegeDataParsed: Joi.array().items(Joi.object({
            schoolName: Joi.string(),
            schoolAddress: Joi.string(),
            admissionYear: Joi.string(),
            graduateYear: Joi.string()
        })),
        seniorDataParsed: Joi.array().items(Joi.object({
            schoolName: Joi.string(),
            schoolAddress: Joi.string(),
            admissionYear: Joi.string(),
            graduateYear: Joi.string()
        })),
        juniorDataParsed: Joi.array().items(Joi.object({
            schoolName: Joi.string(),
            schoolAddress: Joi.string(),
            admissionYear: Joi.string(),
            graduateYear: Joi.string()
        })),
        elementaryDataParsed: Joi.array().items(Joi.object({
            schoolName: Joi.string(),
            schoolAddress: Joi.string(),
            admissionYear: Joi.string(),
            graduateYear: Joi.string()
        })),
        kindergartenDataParsed: Joi.array().items(Joi.object({
            schoolName: Joi.string(),
            schoolAddress: Joi.string(),
            admissionYear: Joi.string(),
            graduateYear: Joi.string()
        })),
    });

    let error = klienSchema.validate(klienData).error;
    return error === undefined;
}