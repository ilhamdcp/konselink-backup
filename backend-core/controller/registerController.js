const validator = require('../validator/registerValidator');
const core = require('../core/registerCore');
const query = require('../database/query');
const constant = require('../constant');

module.exports.registerKlien = async function (req, res) {
    try {
        let data = req.body;
        let userId = req.decodedToken.userId;
        let isValid = validator.validateKlienData(data);

        if (isValid) {
            let { klien_data, parentsData, siblingsData } = core.mapKlienData(data, userId);

            await query.insertJSONData(klien_data, constant.table.KLIEN_DATA);
            for (const parentData of parentsData) {
                await query.insertJSONData(parentData, constant.table.KLIEN_PARENTS_DATA);
            }
            for (const siblingData of siblingsData) {
                await query.insertJSONData(siblingData, constant.table.KLIEN_SIBLINGS_DATA);
            }

            res.status(200).json({
                code: 200,
                message: "Data has been successfully inserted to database!"
            });
        } else {
            res.status(constant.BAD_REQUEST.code).json(constant.BAD_REQUEST);
        }
    } catch (err) {
        console.log("Error when register on registerKlien, error: " , err);
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.registerPsikolog = async function (req, res) {
    try {
        let data = req.body;
        let userId = req.decodedToken.userId;
        let isValid = validator.validatePsikologData(data);

        if (isValid) {
            let psikologData = core.mapPsikologData(data, userId);
            await query.insertJSONData(psikologData, constant.table.PSIKOLOG_DATA);

            res.status(200).json({
                code: 200,
                message: "Data has been successfully inserted to database!"
            })
        } else {
            res.status(constant.BAD_REQUEST.code).json(constant.BAD_REQUEST);
        }
    } catch (err) {
        console.log("Error when register on registerPsikolog, error: " , err);
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.submitSurvey = async function (req, res) {
    try {
        let surveyData = req.body;
        let isValid = validator.validateSubmitSurveyData(surveyData);

        if (!isValid) {
            res.status(constant.BAD_REQUEST.code).json(constant.BAD_REQUEST);
        } else {
            let klienId = req.decodedToken.userId;
            let mappedSurvey = core.mapSubmitSurveyData(surveyData, klienId);
            for (let survey of mappedSurvey) {
                await query.insertJSONData(survey, constant.table.REGISTRATION_SURVEY);
            }

            res.status(200).json({
                code: 200,
                message: "Successfully submitted registration survey data!"
            });
        }
    } catch (err) {
        console.log("Error when register on submitSurvey, error: " , err);
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.getSurvey = async function (req, res) {
    try {
        let klienId = req.query.clientId;
        let questionType = req.query.questionType;
        let isValid = validator.validateGetSurveyParam(klienId, questionType);

        if (!isValid) {
            res.status(constant.BAD_REQUEST.code).json(constant.BAD_REQUEST);
        } else {
            let surveyData = await query.getRegistrationSurveyData(klienId, questionType);
            let mappedSurveyData = core.mapSurveyDataResponse(surveyData, questionType);

            res.status(200).json({
                code: 200,
                result: mappedSurveyData
            });
        }

    } catch (err) {
        console.log("Error when register on getSurvey, error: " , err);
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.getKlienData = async function (req, res) {
    let klienId = req.params.klienId;
    let isValid = validator.validateId(klienId);

    if (!isValid) {
        res.status(constant.BAD_REQUEST.code).json(constant.BAD_REQUEST);
    } else {
        let klienData = await query.getKlienDataByKlienId(klienId);
        let klienParentsData = await query.getKlienParentsDataByKlienId(klienId);
        let klienSiblingsData = await query.getKlienSiblingsDataByKlienId(klienId);
        let mappedKlienData = core.mapKlienDataResponse(klienData, klienParentsData, klienSiblingsData);

        res.status(200).json({
            code: 200,
            data: mappedKlienData
        });
    }
}