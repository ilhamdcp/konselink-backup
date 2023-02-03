const dateUtils = require('../utils/date');
const query = require('../database/query');
const awsS3 = require('../utils/awsS3');
const constant = require('../constant');

module.exports.mapListPsikologSchedules = function (schedules, month, year) {
    let mappedSchedules = [];
    let daySchedule = {};

    for (let schedule of schedules) {
        let startTime = new Date(schedule.start_times);
        let endTime = new Date(schedule.end_times);
        let day = dateUtils.getDateStringFromDateObject(startTime);

        if (dateUtils.getMonthFromDateObject(startTime).toString() === month &&
            dateUtils.getYearFromDateObject(startTime).toString() === year) {
            if (!daySchedule[day]) {
                daySchedule[day] = [];
            }
            let time = {
                scheduleId: schedule.id,
                time: dateUtils.getTimeStringFromDateObject(startTime) + "-" +
                    dateUtils.getTimeStringFromDateObject(endTime),
                clientId: schedule.klien_id,
                clientName: schedule.name,
                isApproved: schedule.is_approved
            }
            daySchedule[day].push(time);
        }
    }

    for (let day of Object.keys(daySchedule)) {
        mappedSchedules.push({
            day: day,
            time: daySchedule[day]
        });
    }
    return mappedSchedules;
};

module.exports.generatePsikologSchedules = async function (psikologId, startDate, endDate, workDays, sessionNum, startTimeStr, interval) {
    let schedules = [];
    let startDateObject = dateUtils.getDateObjectFromDateAndTimeString(startDate, startTimeStr);
    let endDateObject = dateUtils.getDateObjectFromDateAndTimeString(endDate, startTimeStr);

    while (startDateObject.getTime() <= endDateObject.getTime()) {
        let currentDate = new Date(startDateObject);

        if (workDays.includes(currentDate.getDay() + 1)) {
            let startTime = new Date(currentDate.toISOString());
            let endTime = new Date(currentDate.toISOString());

            for (let i = 0; i < sessionNum; i++) {
                endTime.setHours(startTime.getHours() + 1, startTime.getMinutes() + 30, 0, 0);
                let overlapSchedules = await query.countOverlapSchedule(startTime, endTime, psikologId);

                if (parseInt(overlapSchedules) === 0) {
                    let schedule = {
                        psikolog_id: psikologId,
                        start_times: startTime.toISOString(),
                        end_times: endTime.toISOString(),
                    }
                    schedules.push(schedule);
                }
                startTime.setHours(endTime.getHours(), endTime.getMinutes() + interval, 0, 0);
            }
        }

        startDateObject.setDate(startDateObject.getDate() + 1);
    }
    return schedules;
};

module.exports.mapKlienOngoingSchedules = function (schedule) {
    if (Object.keys(schedule).length === 0) {
        return {
            scheduleId: null,
            day: null,
            time: null,
            counselorId: null,
            counselorName: null
        }
    } else {
        let startTime = new Date(schedule.start_times);
        let endTime = new Date(schedule.end_times);

        return {
            scheduleId: schedule.id,
            day: dateUtils.getDateStringFromDateObject(startTime),
            time: dateUtils.getTimeStringFromDateObject(startTime) + "-" +
                dateUtils.getTimeStringFromDateObject(endTime),
            counselorId: schedule.psikolog_id,
            counselorName: schedule.name
        }
    }
};

module.exports.mapPsikologOngoingSchedules = function (schedule) {
    if (Object.keys(schedule).length === 0) {
        return {
            scheduleId: null,
            day: null,
            time: null,
            clientId: null,
            clientName: null
        }
    } else {
        let startTime = new Date(schedule.start_times);
        let endTime = new Date(schedule.end_times);

        return {
            scheduleId: schedule.id,
            day: dateUtils.getDateStringFromDateObject(startTime),
            time: dateUtils.getTimeStringFromDateObject(startTime) + "-" +
                dateUtils.getTimeStringFromDateObject(endTime),
            clientId: schedule.klien_id,
            clientName: schedule.name
        }
    }
};

module.exports.mapApprovalRejectionNotificationParams = function (type, schedule, psikolog) {
    return {
        type,
        counselorId: schedule.psikolog_id,
        receiverId: schedule.klien_id,
        scheduleId: schedule.id,
        counselorName: psikolog.fullname,
        displayPictureUrl: psikolog.has_display_picture ?
            awsS3.getDisplayPictureUrl(psikolog.user_id, constant.konselingRole.PSIKOLOG) : null
    }
};

module.exports.mapRequestNotificationParams = function (type, schedule, klien) {
    return {
        type,
        clientId: klien.user_id,
        receiverId: schedule.psikolog_id,
        scheduleId: schedule.id,
        clientName: klien.name,
        displayPictureUrl: klien.has_display_picture ?
            awsS3.getDisplayPictureUrl(klien.user_id, constant.konselingRole.KLIEN) : null
    }
};