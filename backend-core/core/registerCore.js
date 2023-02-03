const constant = require('../constant');
const camelCaseKeys = require('camelcase-keys');
const ipipScoring = require('./ipip-scoring.json');

module.exports.mapKlienData = function (data, id) {
    const klien_data = {
        user_id: id,
        address: data.address,
        birth_place: data.birthPlace,
        birth_day: data.birthDay,
        birth_month: data.birthMonth,
        birth_year: data.birthYear,
        college_data: data.collegeData,
        complaint: data.complaint,
        current_education: data.currentEducation,
        effort_done: data.effortDone,
        elementary_data: data.elementaryData,
        gender: data.gender,
        has_consulted: data.hasConsultedBefore,
        junior_data: data.juniorData,
        kindergarten_data: data.kindergartenData,
        month_consulted: data.monthConsulted,
        name: data.name,
        phone_number: data.phoneNumber,
        place_consulted: data.placeConsulted,
        problem: data.problem,
        religion: data.religion,
        senior_data: data.seniorData,
        solution: data.solution,
        year_consulted: data.yearConsulted
    };

    const parentsData = [
        {
            user_id: id,
            type: constant.parentType.FATHER,
            address: data.fatherAddress,
            age: data.fatherAge,
            education: data.fatherEducation,
            name: data.fatherName,
            occupation: data.fatherOccupation,
            religion: data.fatherReligion,
            tribe: data.fatherTribe
        },
        {
            user_id: id,
            type: constant.parentType.MOTHER,
            address: data.motherAddress,
            age: data.motherAge,
            education: data.motherEducation,
            name: data.motherName,
            occupation: data.motherOccupation,
            religion: data.motherReligion,
            tribe: data.motherTribe
        }
    ];

    let siblingsData = [];
    let siblingNumbers = [1,2,3,4,5];
    let siblingKeys = Object.keys(data).filter(key => key.includes("sibling"));

    siblingNumbers.forEach(function (number) {
       let siblingNum = "sibling" + number;
       let siblingNKey = siblingKeys.filter(key => key.includes(siblingNum));
       if (siblingNKey.length > 1) { //check if its just education or complete data (education is default)
           const sibling = {
               user_id: id,
               sibling_number: number,
               age: data[siblingNum+"Age"],
               education: data[siblingNum+"Education"],
               gender: data[siblingNum+"Gender"],
               name: data[siblingNum+"Name"],
               occupation: data[siblingNum+"Occupation"]
           };
           siblingsData.push(sibling);
       }
    });
    return { klien_data, parentsData, siblingsData };
};

module.exports.mapPsikologData = function(data, id) {
    return {
        user_id: id,
        fullname: data.fullname,
        gender: data.gender,
        specialization: data.specialization,
        sip_number: data.sipNumber,
        str_number: data.strNumber,
        ssp_number: data.sspNumber
    }
};

module.exports.mapSubmitSurveyData = function (surveyData, klienId) {
    let mappedData = [];
    surveyData.SRQ.map(srqData => {
        mappedData.push({
            answer_key: srqData.answerKey,
            answer_value: srqData.answerValue,
            klien_id: klienId,
            question_type: constant.questionType.SRQ
        });
    });
    surveyData.IPIP.map(srqData => {
        mappedData.push({
            answer_key: srqData.answerKey,
            answer_value: srqData.answerValue,
            klien_id: klienId,
            question_type: constant.questionType.IPIP
        });
    });

    return mappedData;
};

const getSRQSurveyResult = function (surveyData) {
    let questionAnsweredYes = surveyData.reduce((total, survey) => {
        if (survey.answer_value > 0) {
            return total + 1;
        }
    });

    return {
        answerYesMoreThanSix: questionAnsweredYes > 6
    }
};

const getIPIPSurveyResult = function (surveyData) {
    let mappedSurveyData = {};
    for (let survey of surveyData) {
        mappedSurveyData[survey.answer_key] = survey.answer_value;
    }
    let result = {};
    for (let scoreKey of Object.keys(ipipScoring)) {
        let score = 0;
        for (let answerKey of ipipScoring[scoreKey]) {
            let answerValue = mappedSurveyData[answerKey];
            if (!isNaN(answerValue)) {
                score += parseInt(answerValue);
            }
        }
        result[scoreKey] = score;
    }
    return result;
}

module.exports.mapSurveyDataResponse = function (surveyData, questionType) {
    if (questionType === constant.questionType.SRQ) {
        return getSRQSurveyResult(surveyData);
    } else {
        return getIPIPSurveyResult(surveyData);
    }
};

module.exports.mapKlienDataResponse = function (klienData, klienParentsData, klienSiblingsData) {
    let mappedKlienData = camelCaseKeys(klienData);
    mappedKlienData.hasConsultedBefore = mappedKlienData.hasConsulted;

    delete mappedKlienData.hasConsulted;
    delete mappedKlienData.userId;
    delete mappedKlienData.hasDisplayPicture;
    delete mappedKlienData.isVerified;

    parseSchoolData(mappedKlienData);

    for (let parentData of klienParentsData) {
        let parentType = parentData.type === constant.parentType.FATHER ? "father" : "mother";
        delete parentData.type;
        delete parentData.user_id;
        for (let key of Object.keys(parentData)) {
            mappedKlienData[parentType + "_" + key] = parentData[key];
        }
    }
    for (let siblingData of klienSiblingsData) {
        let siblingNumber = siblingData.sibling_number;
        delete siblingData.sibling_number;
        delete siblingData.user_id;
        for (let key of Object.keys(siblingData)) {
            mappedKlienData["sibling" + siblingNumber + "_" + key] = siblingData[key];
        }
    }
    return camelCaseKeys(mappedKlienData);
};

const parseSchoolData = function (mappedKlienData) {
    for (let key of constant.SCHOOL_DATA_KEY) {
        let schoolDataArr = mappedKlienData[key].split(";");
        let schoolParsedData = [];
        for (let schoolData of schoolDataArr) {
            let schoolDetail = schoolData.split("/");
            if (schoolDetail.length === 4) {
                schoolParsedData.push({
                    schoolName: schoolDetail[0],
                    schoolAddress: schoolDetail[1],
                    admissionYear: schoolDetail[2],
                    graduateYear: schoolDetail[3]
                })
            }
        }
        mappedKlienData[key + "Parsed"] = schoolParsedData
    }
}