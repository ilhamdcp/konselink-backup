const awsS3 = require('../utils/awsS3');
const constant = require('../constant');
const dateUtils = require('../utils/date');

const mapSchedule = function (psikologSchedules) {
    let schedules = [];
    let daySchedule = {};

    for (let psikologSchedule of psikologSchedules) {
        let startTime = new Date(psikologSchedule.start_times);
        let endTime = new Date(psikologSchedule.end_times);
        let day = dateUtils.getDateStringFromDateObject(startTime);

        if (!daySchedule[day]) {
            daySchedule[day] = [];
        }
        daySchedule[day].push({
            scheduleId: psikologSchedule.id,
            time: dateUtils.getTimeStringFromDateObject(startTime) + "-" +
                dateUtils.getTimeStringFromDateObject(endTime)
        });
    }

    for (let day of Object.keys(daySchedule)) {
        schedules.push({
            day: day,
            time: daySchedule[day]
        });
    }
    return schedules;
};

module.exports.mapDetailPsikologData = function (psikologDetailData, psikologSchedules) {
    return {
        fullName: psikologDetailData.fullname,
        counselorId: psikologDetailData.user_id,
        strNumber: psikologDetailData.str_number,
        sipNumber: psikologDetailData.sip_number,
        sspNumber: psikologDetailData.ssp_number,
        specialization: psikologDetailData.specialization,
        schedule: mapSchedule(psikologSchedules),
        displayPictureUrl: psikologDetailData.has_display_picture
            ? awsS3.getDisplayPictureUrl(psikologDetailData.user_id, constant.konselingRole.PSIKOLOG) : null
    }
}