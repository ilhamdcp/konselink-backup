const awsS3 = require('../utils/awsS3');
const constant = require('../constant');
const dateUtils = require('../utils/date');

module.exports.getTotalPage = function(objects, entrySize) {
    let totalPage = 0;
    if (objects.length > 0) {
        let fullCount = objects[0].full_count;
        totalPage = Math.floor(fullCount/entrySize);

        if (totalPage % entrySize > 0 || totalPage === 0) {
            totalPage += 1;
        }
    }
    return totalPage;
};

module.exports.mapPsikologUsers = async function (psikologUsers) {
    return psikologUsers.map(psikologUser => {
        return {
            counselorId: psikologUser.user_id,
            fullName: psikologUser.fullname,
            specialization: psikologUser.specialization,
            displayPictureUrl: psikologUser.has_display_picture
                ? awsS3.getDisplayPictureUrl(psikologUser.user_id, constant.konselingRole.PSIKOLOG) : null
        }
    });
};

module.exports.mapKlienRequest = async function (klienRequests) {
    return klienRequests.map(klienRequest => {
        return {
            requestId: klienRequest.id,
            clientId: klienRequest.klien_id,
            name: klienRequest.name,
            startTime: klienRequest.start_times,
            endTime: klienRequest.end_times,
            displayPictureUrl: klienRequest.has_display_picture
                ? awsS3.getDisplayPictureUrl(klienRequest.user_id, constant.konselingRole.KLIEN) : null,
        }
    });
};

module.exports.mapKlienUpcomingSchedules = function (schedules) {
    return schedules.map(schedule => {
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
    });
};

module.exports.mapPsikologUpcomingSchedules = function (schedules) {
    return schedules.map(schedule => {
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
    });
};

module.exports.mapIcdCodeList = function (icdCodes) {
    return icdCodes.map(icdCode => {
        return {
            codeId: icdCode.id,
            icd9Code: icdCode.icd_9_cm,
            icd10Code: icdCode.icd_10_cm,
            disorder: icdCode.disorder
        }
    });
}