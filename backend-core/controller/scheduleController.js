const query = require('../database/query');
const validator = require('../validator/scheduleValidator');
const core = require('../core/scheduleCore');
const constant = require('../constant');
const socket = require('../utils/socket');

module.exports.approveClientRequest = async function (req, res) {
    try {
        let scheduleRequest = await query.getScheduleById(req.params.requestId);
        let psikolog = await query.getPsikologUserById(req.decodedToken.userId);

        if (Object.keys(scheduleRequest).length === 0 || Object.keys(psikolog).length === 0) {
            res.status(constant.NOT_FOUND.code).json(constant.NOT_FOUND);
        } else {
            await query.approveClientRequest(scheduleRequest.id);
            let notificationParams = core.mapApprovalRejectionNotificationParams(constant.nofiticationType.APPROVAL,
                                                                                    scheduleRequest, psikolog);
            socket.sendNotification(notificationParams);

            res.status(200).json({
                code: 200,
                message: "Successfully approved client request!"
            })
        }
    } catch (err) {
        console.log("Error on schedule when approveClientRequest, error: " , err)
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.rejectClientRequest = async function (req, res) {
    try {
        let scheduleRequest = await query.getScheduleById(req.params.requestId);
        let psikolog = await query.getPsikologUserById(req.decodedToken.userId);

        if (Object.keys(scheduleRequest).length === 0) {
            res.status(constant.NOT_FOUND.code).json(constant.NOT_FOUND);
        } else {
            await query.rejectClientRequest(scheduleRequest.id);
            let notificationParams = core.mapApprovalRejectionNotificationParams(constant.nofiticationType.REJECTION,
                scheduleRequest, psikolog);
            socket.sendNotification(notificationParams);

            res.status(200).json({
                code: 200,
                message: "Successfully rejected client request!"
            })
        }
    } catch (err) {
        console.log("Error on schedule when rejectClientRequest, error: " , err)
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.clientRequestSchedule = async function (req, res) {
    try {
        let scheduleId = req.params.scheduleId;
        let isValid = validator.validateKlienScheduleRequestParam(scheduleId);

        if (isValid) {
            let schedule = await query.getAvailableScheduleByCounselDateTimeAndPsikologId(scheduleId);
            let klien = await query.getKlienUserById(req.decodedToken.userId);

            if (Object.keys(schedule).length === 0 || Object.keys(klien).length === 0){
                res.status(constant.NOT_FOUND.code).json(constant.NOT_FOUND);
            } else {
                await query.updatePsikologScheduleKlien(klien.id, schedule.id);
                let notificationParams = core.mapRequestNotificationParams(constant.nofiticationType.REQUEST,
                    schedule, klien);
                socket.sendNotification(notificationParams);

                res.status(200).json({
                    code: 200,
                    message: "Successfully request schedule"
                })
            }
        } else {
            res.status(constant.BAD_REQUEST.code).json(constant.BAD_REQUEST);
        }
    } catch (err) {
        console.log("Error on schedule when clientRequestSchedule, error: " , err)
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.listPsikologSchedule = async function (req, res) {
    try {
        let psikologId = req.decodedToken.userId;
        let month = req.query.month;
        let year = req.query.year;
        let isParamValid = validator.validateListPsikologScheduleParam(month, year);

        if (isParamValid) {
            let schedules = await query.getScheduleByPsikologId(psikologId);

            let mappedSchedule = core.mapListPsikologSchedules(schedules, month, year);

            res.status(200).json({
                code: 200,
                schedule: mappedSchedule
            });
        } else {
            res.status(constant.BAD_REQUEST.code).json(constant.BAD_REQUEST);
        }
    } catch (err) {
        console.log("Error on schedule when listPsikologSchedule, error: " , err)
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.deletePsikologSchedule = async function (req, res) {
    try {
        let schedule = await query.getScheduleById(req.params.scheduleId);

        if (Object.keys(schedule).length === 0) {
            res.status(constant.NOT_FOUND.code).json(constant.NOT_FOUND);
        } else {
            await query.deleteSchedule(schedule.id);

            res.status(200).json({
                code: 200,
                message: "Successfully deleted schedule!"
            })
        }
    } catch (err) {
        console.log("Error on schedule when deletePsikologSchedule, error: " , err)
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.createPsikologSchedule = async function (req, res) {
    try {
        let startDate = req.body.startDate;
        let endDate = req.body.endDate;
        let workDays = req.body.workDays;
        let sessionNum = req.body.sessionNum;
        let startTime = req.body.startTime;
        let interval = req.body.interval;

        let isParamValid = validator.validateCreatePsiklogScheduleParams(startDate, endDate, workDays,
                                                                        sessionNum, startTime, interval);
        if (isParamValid) {
            let psikologUser = await query.getPsikologUserById(req.decodedToken.userId);

            if (Object.keys(psikologUser).length === 0) {
                res.status(constant.NOT_FOUND.code).json(constant.NOT_FOUND);
            } else {
                let psikologSchedules = await core.generatePsikologSchedules(psikologUser.id,
                    startDate, endDate, workDays, sessionNum, startTime, interval);
                psikologSchedules.forEach(psikologSchedule => query.insertJSONData(psikologSchedule, constant.table.PSIKOLOG_SCHEDULE));
                res.status(200).json({
                    code: 200,
                    message: "Successfully inserted schedule!"
                })
            }
        } else {
            res.status(constant.BAD_REQUEST.code).json(constant.BAD_REQUEST);
        }
    } catch (err) {
        console.log("Error on schedule when createPsikologSchedule, error: " , err)
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.getKlienOngoingSchedule = async function (req, res) {
    try {
        let klienId = req.decodedToken.userId;
        let schedule = await query.getKlienOngoingSchedule(klienId);
        let mappedSchedule = core.mapKlienOngoingSchedules(schedule);

        res.status(200).json({
            code: 200,
            schedule: mappedSchedule
        })
    } catch (err) {
        console.log("Error on schedule when getKlienOngoingSchedule, error: " , err)
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.getPsikologOngoingSchedule = async function (req, res) {
    try {
        let psikologId = req.decodedToken.userId;
        let schedule = await query.getPsikologOngoingSchedule(psikologId);
        let mappedSchedule = core.mapPsikologOngoingSchedules(schedule);

        res.status(200).json({
            code: 200,
            schedule: mappedSchedule
        })
    } catch (err) {
        console.log("Error on schedule when getPsikologOngoingSchedule, error: " , err)
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};