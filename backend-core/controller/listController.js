const constant = require('../constant');
const query = require('../database/query');
const core = require('../core/listCore');
const validator = require('../validator/listValidator');

module.exports.getPsikologList = async function (req, res) {
    try {
        let { entrySize, pageNo, keyword } = validator.validateListParams(req.query.entrySize, req.query.pageNo, req.query.keyword);
        let offset = (pageNo - 1) * entrySize;
        let users = await query.getPsikologDataList(entrySize, offset, keyword);
        let mappedUsers = await core.mapPsikologUsers(users);

        res.status(200).json({
            code: 200,
            data: mappedUsers,
            pageNo: parseInt(pageNo),
            totalPage: core.getTotalPage(users, entrySize)
        });
    } catch (err) {
        console.log("Error on list when getPsikologList, error: " , err);
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.getKlienRequestList = async function (req, res) {
    try {
        let { entrySize, pageNo, keyword } = validator.validateListParams(req.query.entrySize, req.query.pageNo, req.query.keyword);
        let offset = (pageNo - 1) * entrySize;
        let klienRequest = await query.getKlienRequestList(entrySize, offset, keyword, req.decodedToken.userId);
        let mappedKlienRequest = await core.mapKlienRequest(klienRequest);

        res.status(200).json({
            code: 200,
            data: mappedKlienRequest,
            pageNo: parseInt(pageNo),
            totalPage: core.getTotalPage(klienRequest, entrySize)
        });
    } catch (err) {
        console.log("Error on list when getKlienRequestList, error: " , err);
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.getKlienUpcomingSchedule = async function (req, res) {
    try {
        let klienId = req.decodedToken.userId;
        let params = validator.validateListParams(req.query.entrySize, req.query.pageNo);
        let offset = (params.pageNo - 1) * params.entrySize;
        let schedules = await query.getKlienUpcomingSchedule(params.entrySize, offset, klienId);
        let mappedSchedules = core.mapKlienUpcomingSchedules(schedules);

        res.status(200).json({
            code: 200,
            schedule: mappedSchedules,
            pageNo: parseInt(params.pageNo),
            totalPage: core.getTotalPage(schedules, params.entrySize)
        });
    } catch (err) {
        console.log("Error on list when getKlienUpcomingSchedule, error: " , err);
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.getPsikologUpcomingSchedule = async function (req, res) {
    try {
        let psikologId = req.decodedToken.userId;
        let params = validator.validateListParams(req.query.entrySize, req.query.pageNo);
        let offset = (params.pageNo - 1) * params.entrySize;
        let schedules = await query.getPsikologUpcomingSchedule(params.entrySize, offset, psikologId);
        let mappedSchedules = core.mapPsikologUpcomingSchedules(schedules);

        res.status(200).json({
            code: 200,
            schedule: mappedSchedules,
            pageNo: parseInt(params.pageNo),
            totalPage: core.getTotalPage(schedules, params.entrySize)
        });
    } catch (err) {
        console.log("Error on list when getPsikologUpcomingSchedule, error: " , err);
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.getIcdCodes = async function (req, res) {
    try {
        let { entrySize, pageNo, keyword } = validator.validateListParams(req.query.entrySize, req.query.pageNo, req.query.keyword);
        let offset = (pageNo - 1) * entrySize;
        let codes = await query.getIcdCodeList(entrySize, offset, keyword);
        let mappedCodes = core.mapIcdCodeList(codes);

        res.status(200).json({
            code: 200,
            icdCodes: mappedCodes,
            pageNo: parseInt(pageNo),
            totalPage: core.getTotalPage(codes, entrySize)
        });
    } catch (err) {
        console.log("Error on list when getIcdCodes, error: " , err);
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};