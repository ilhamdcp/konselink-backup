const panasScoring = require('./panas-scoring.json');

module.exports.mapChatHistories = function (chats) {
    let sortedChats = chats.sort((chat,anotherChat) => {
        let timestamp = new Date(chat.timestamp).getTime();
        let anotherTimestamp = new Date(anotherChat.timestamp).getTime();
        return timestamp - anotherTimestamp;
    })
    return sortedChats.map(chat => {
        return {
            scheduleId: chat.schedule_id,
            message: chat.message,
            senderId: chat.sender_id,
            timestamp: chat.timestamp
        }
    })
};

module.exports.mapSurveyData = function (surveyData, scheduleId) {
    return surveyData.map(survey => {
        return {
            schedule_id: scheduleId,
            answer_key: survey.answerKey,
            answer_value: survey.answerValue
        }
    })
};

module.exports.mapRecordData = function (recordData) {
    return {
        schedule_id: recordData.scheduleId,
        diagnosis: recordData.diagnosis,
        diagnosis_code: recordData.diagnosisCode,
        physical_health_history: recordData.physicalHealthHistory,
        medical_consumption: recordData.medicalConsumption,
        suicide_risk: recordData.suicideRisk,
        self_harm_risk: recordData.selfHarmRisk,
        others_harm_risk: recordData.othersHarmRisk,
        assessment: recordData.assessment,
        consultation_purpose: recordData.consultationPurpose,
        treatment_plan: recordData.treatmentPlan,
        meetings: recordData.meetings,
        notes: recordData.notes
    }
};

module.exports.getSurveyResult = function (surveyData) {
    let mappedSurveyData = {};
    for (let survey of surveyData) {
        mappedSurveyData[survey.answer_key] = survey.answer_value;
    }
    let positive = 0;
    let negative = 0;
    for (let answerKey of panasScoring.positive) {
        let score = mappedSurveyData[answerKey];
        if (!isNaN(score)) {
            positive += mappedSurveyData[answerKey];
        }
    }
    for (let answerKey of panasScoring.negative) {
        let score = mappedSurveyData[answerKey];
        if (!isNaN(score)) {
            negative += mappedSurveyData[answerKey];
        }
    }
    return [{
        answerKey: "positive",
        answerValue: positive
    }, {
        answerKey: "negative",
        answerValue: negative
    }]
};

module.exports.mapRecordResponseData = function (recordData) {
    return recordData.map(record => {
        return {
            diagnosis: record.diagnosis,
            physicalHealthHistory: record.physical_health_history,
            medicalConsumption: record.medical_consumption,
            suicideRisk: record.suicide_risk,
            selfHarmRisk: record.self_harm_risk,
            assessment: record.assessment,
            consultationPurpose: record.consultation_purpose,
            treatmentPlan: record.treatment_plan,
            meetings: record.meetings,
            notes: record.notes,
            counselorName: record.fullname,
            counselorId: record.psikolog_id,
            icd9Code: record.icd_9_cm,
            icd10Code: record.icd_10_cm,
            disorder: record.disorder
        }
    })
}