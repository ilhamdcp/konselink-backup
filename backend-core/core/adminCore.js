const constant = require('../constant');
const awsS3 = require('../utils/awsS3');
const dateUtils = require('../utils/date');
const query = require('../database/query');
const xl = require('excel4node');
const chatCore = require('../core/chatCore');

module.exports.mapListKlien = function (listKlien) {
    return listKlien.map(klienData => {
        return {
            id: klienData.user_id,
            name: klienData.name,
            npm: klienData.npm,
            faculty: klienData.fakultas,
            isVerified: klienData.is_verified,
            displayPictureUrl: klienData.has_display_picture ?
                awsS3.getDisplayPictureUrl(klienData.user_id, constant.konselingRole.KLIEN) : null
        }
    })
};

module.exports.mapListPsikolog = function (listPsikolog) {
    return listPsikolog.map(psikologData => {
        return {
            id: psikologData.user_id,
            name: psikologData.fullname,
            specialization: psikologData.specialization,
            sipNumber: psikologData.sip_number,
            strNumber: psikologData.str_number,
            sspNumber: psikologData.ssp_number,
            isVerified: psikologData.is_verified,
            displayPictureUrl: psikologData.has_display_picture ?
                awsS3.getDisplayPictureUrl(psikologData.user_id, constant.konselingRole.PSIKOLOG) : null
        }
    });
};

const isNotEmptyAndNotNull = function (string) {
    return string !== null && string !== "";
}

module.exports.generateExcel = async function (startDate, endDate) {
    let startTime = dateUtils.getDateObjectFromDateAndTimeString(startDate, "00:00");
    let endTime = dateUtils.getDateObjectFromDateAndTimeString(endDate, "23:59");
    let datas = await query.getPeriodicalData(startTime, endTime);
    let workbook = new xl.Workbook();
    let worksheet = workbook.addWorksheet("data");

    let header = ["Nama Psikolog", "NPM Psikolog", "Nama Klien", "NPM Klien", "Tanggal", "Jam Mulai", "Jam Selesai", "Diagnosis",
    "Riwayat Kesehatan Fisik", "Konsumsi Obat", "Risiko Bunuh Diri", "Risiko Menyakiti Diri", "Risiko menyakiti Orang Lain",
    "Asesmen", "Tujuan Kedatangan", "Rencana Penanganan", "Jumlah Rencana Pertemuan", "Catatan", "Deskripsi Masalah",
    "Kode Diagnosis (ICD 9)", "Kode Diagnosis (ICD 10)","Diagnosis ICD", "Survei PANAS (Positif)", "Survei PANAS (negatif)"];

    header.forEach(function (value, index) {
        worksheet.cell(1, index + 1).string(value);
    });

    let index = 0;

    for (let data of datas) {
        let surveyData = await query.getPreConsultationSurveyByScheduleId(data.schedule_id);
        let panas = chatCore.getSurveyResult(surveyData);
        let row = index + 2;
        let column = 1;
        worksheet.cell(row, column++).string(data.psikolog_name);
        worksheet.cell(row, column++).string(isNotEmptyAndNotNull(data.psikolog_npm) ? data.psikolog_npm : "-");
        worksheet.cell(row, column++).string(data.klien_name);
        worksheet.cell(row, column++).string(isNotEmptyAndNotNull(data.klien_npm) ? data.klien_npm : "-");
        worksheet.cell(row, column++).string(dateUtils.getDateStringFromDateObject(new Date(data.start_times)));
        worksheet.cell(row, column++).string(dateUtils.getTimeStringFromDateObject(new Date(data.start_times)));
        worksheet.cell(row, column++).string(dateUtils.getTimeStringFromDateObject(new Date(data.end_times)));
        worksheet.cell(row, column++).string(isNotEmptyAndNotNull(data.diagnosis) ? data.diagnosis : "-");
        worksheet.cell(row, column++).string(data.physical_health_history);
        worksheet.cell(row, column++).string(data.medical_consumption);
        worksheet.cell(row, column++).string(data.suicide_risk);
        worksheet.cell(row, column++).string(data.self_harm_risk);
        worksheet.cell(row, column++).string(data.others_harm_risk);
        worksheet.cell(row, column++).string(data.assessment);
        worksheet.cell(row, column++).string(data.consultation_purpose);
        worksheet.cell(row, column++).string(data.treatment_plan);
        worksheet.cell(row, column++).number(data.meetings);
        worksheet.cell(row, column++).string(isNotEmptyAndNotNull(data.notes) ? data.notes : "-");
        worksheet.cell(row, column++).string(isNotEmptyAndNotNull(data.problem_description) ? data.problem_description : "-");
        worksheet.cell(row, column++).string(isNotEmptyAndNotNull(data.icd_9_cm) ? data.icd_9_cm : "-");
        worksheet.cell(row, column++).string(isNotEmptyAndNotNull(data.icd_10_cm) ? data.icd_10_cm : "-");
        worksheet.cell(row, column++).string(isNotEmptyAndNotNull(data.disorder) ? data.disorder : "-");
        worksheet.cell(row, column++).number(panas[0].answerValue);
        worksheet.cell(row, column++).number(panas[1].answerValue);
        index++;
    }
    return workbook;
};