const constant = require('../constant');
const validator = require('../validator/chatValidator');
const core = require('../core/chatCore');
const query = require('../database/query');

module.exports.getHistory = async function (req, res) {
    try {
        let scheduleId = req.query.scheduleId;
        let timestamp = req.query.timestamp;

        let isValid = validator.validateChatParams(scheduleId, timestamp);
        if (!isValid) {
            res.status(constant.BAD_REQUEST.code).json(constant.BAD_REQUEST);
        } else {
            let chats = await query.getSenderChatHistoryFromGivenTimestamp(scheduleId, timestamp);
            let mappedChats = core.mapChatHistories(chats);
            res.status(200).json({
                code: 200,
                chat: mappedChats
            })
        }
    } catch (err) {
        console.log("Error on chat when getHistory, error: " , err)
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.submitSurvey = async function (req, res) {
    try {
        let surveyData = req.body.survey;
        let scheduleId = req.body.scheduleId;
        let isValid = validator.validateSurveyData(surveyData, scheduleId);
        let survey = await query.getPreConsultationSurveyByScheduleId(scheduleId);

        if (survey.length > 0) {
            res.status(200).json({
                code: 200,
                message: "Data already inserted!"
            });
        }

        if (!isValid) {
            res.status(constant.BAD_REQUEST.code).json(constant.BAD_REQUEST);
        } else {
            let mappedSurveyData = core.mapSurveyData(surveyData, scheduleId);
            mappedSurveyData.forEach(survey => {
                query.insertJSONData(survey, constant.table.PRECONSULTATION_SURVEY);
            })

            res.status(200).json({
                code: 200,
                message: "Successfully inserted survey data!"
            });
        }
    } catch (err) {
        console.log("Error on chat when submitSurvey, error: " , err)
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.submitRecord = async function (req, res) {
    try {
        let recordData = req.body;
        let isRecordValid = validator.validateRecordData(recordData);

        if (!isRecordValid) {
            res.status(constant.BAD_REQUEST.code).json(constant.BAD_REQUEST);
        } else {
            let mappedRecordData = core.mapRecordData(recordData);
            await query.insertJSONData(mappedRecordData, constant.table.KLIEN_RECORD);
            await query.updateScheduleDone(recordData.scheduleId);

            res.status(200).json({
                code: 200,
                message: "Successfully inserted record data!"
            });
        }

    } catch (err) {
        console.log("Error on chat when submitRecord, error: " , err);
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.getSurvey = async function (req, res) {
    try {
        let scheduleId = req.params.scheduleId;
        let isValid = validator.validateId(scheduleId);

        if (!isValid) {
            res.status(constant.BAD_REQUEST.code).json(constant.BAD_REQUEST);
        } else {
            let surveyData = await query.getPreConsultationSurveyByScheduleId(scheduleId);
            let surveyDataResponse = core.getSurveyResult(surveyData);

            res.status(200).json({
                code: 200,
                result: surveyDataResponse
            })
        }
    } catch (err) {
        console.log("Error on chat when getSurvey, error: " , err);
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.getRecord = async function (req, res) {
    try {
        let klienId = req.params.klienId;
        let isValid = validator.validateId(klienId);

        if (!isValid) {
            res.status(constant.BAD_REQUEST.code).json(constant.BAD_REQUEST);
        } else {
            let recordData = await query.getKlienRecordByKlienId(klienId);
            let recordResponseData = core.mapRecordResponseData(recordData);

            res.status(200).json({
                code: 200,
                record: recordResponseData
            })
        }
    } catch (err) {
        console.log("Error on chat when getRecord, error: " , err);
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};