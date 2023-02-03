const execute = require('./query-executor').execute;

const insert = async function(table, columns, values) {
    let params = [];
    columns.forEach((value, index) => {
        params.push("$"+(index+1));
    });
    let query = "INSERT INTO " + table + "(" + columns.join(",") + ")" + " VALUES (" + params.join(",") + ")";
    await execute(query, values);
};

module.exports.insertJSONData = async function (data, table) {
    let jsonConstructor = ({}).constructor;
    if (data.constructor !== jsonConstructor) {
        throw new Error("object is not a JSON");
    }
    let columns = Object.keys(data);
    let values = [];

    for (let column of columns) {
        let value = data[column];
        if (value !== undefined && value.constructor === jsonConstructor) {
            throw new Error("object has nested value");
        }
        values.push(value);
    }
    return await insert(table, columns, values);
};

const getObject = function(objects) {
    if (objects.length === 0) {
        return {};
    }
    return objects[0];
};

module.exports.getUserByUsernameAndLoginType = async function(username, loginType){
    let query = "SELECT * FROM konselink_user WHERE username = $1 AND login_type = $2";
    let params = [username, loginType];
    let response = await execute(query, params);

    return getObject(response.rows);
};

module.exports.getUserById = async function(id) {
    let query = "SELECT * FROM konselink_user WHERE id = $1";
    let params = [id];
    let response = await execute(query, params);

    return getObject(response.rows);
};

module.exports.getPsikologUserById = async function(id) {
    let query = "SELECT ku.*, pd.has_display_picture, pd.user_id, pd.is_verified, pd.fullname" +
        " FROM konselink_user ku LEFT JOIN psikolog_data pd ON id = user_id WHERE id = $1";
    let params = [id];
    let response = await execute(query, params);

    return getObject(response.rows);
};

module.exports.getKlienUserById = async function(id) {
    let query = "SELECT ku.*, kd.has_display_picture, kd.user_id, kd.name as nick_name, kd.is_verified" +
        " FROM konselink_user ku LEFT JOIN klien_data kd ON id = user_id WHERE id = $1";
    let params = [id];
    let response = await execute(query, params);

    return getObject(response.rows);
};

module.exports.getScheduleById = async function(requestId) {
    let query = "SELECT * FROM psikolog_schedule WHERE id = $1";
    let params = [requestId];
    let response = await execute(query, params);

    return getObject(response.rows);
};

module.exports.getScheduleByPsikologId = async function(psikologId) {
    let query = "SELECT ku.name , ps.* FROM psikolog_schedule ps " +
        "LEFT JOIN konselink_user ku ON klien_id = ku.id WHERE psikolog_id = $1 ORDER BY start_times";
    let params = [psikologId];
    let response = await execute(query, params);

    return response.rows;
};

module.exports.countOverlapSchedule = async function(startTime, endTime, psikologId) {
    let query = "SELECT id FROM psikolog_schedule WHERE psikolog_id = $3 AND (start_times BETWEEN $1 AND $2 OR end_times BETWEEN $1 AND $2)";
    let params = [startTime, endTime, psikologId];
    let response = await execute(query, params);

    return response.rows.length;
};

module.exports.getAvailableScheduleByCounselDateTimeAndPsikologId = async function(scheduleId) {
    let query = "SELECT * FROM psikolog_schedule WHERE id = $1";
    let params = [scheduleId];
    let response = await execute(query, params);

    return getObject(response.rows);
};

module.exports.updatePsikologScheduleKlien = async function(klienId, requestId) {
    let query = "UPDATE psikolog_schedule SET klien_id = $1 WHERE id = $2";
    let params = [klienId, requestId];
    await execute(query, params);
}

module.exports.deleteUserByUsernameAndLoginType = async function(username, loginType) {
    let query = "DELETE FROM konselink_user WHERE username = $1 AND login_type = $2";
    let params = [username, loginType];
    await execute(query, params);
};

module.exports.getAdminKlienDataList = async function(limit, offset, keyword, isVerified) {
    let query = "SELECT ku.*, kd.has_display_picture, kd.user_id, kd.is_verified, count(*) OVER() AS full_count" +
        " FROM klien_data kd JOIN konselink_user ku ON user_id = id WHERE is_verified = $3";
    if (keyword) {
        keyword = "(\'%" + keyword + "%\')";
        query += " AND lower(ku.name) LIKE lower" + keyword;
    }
    query += " ORDER BY user_id LIMIT $1 OFFSET $2";

    let params = [limit, offset, isVerified];
    let response = await execute(query, params);
    return response.rows;
};

module.exports.getAdminPsikologDataList = async function(limit, offset, keyword, isVerified) {
    let query = "SELECT pd.*, count(*) OVER() AS full_count" +
        " FROM psikolog_data pd JOIN konselink_user ku ON user_id = id WHERE is_verified = $3";
    if (keyword) {
        keyword = "(\'%" + keyword + "%\')";
        query += " AND lower(fullname) LIKE lower" + keyword;
    }
    query += " ORDER BY user_id LIMIT $1 OFFSET $2";

    let params = [limit, offset, isVerified];
    let response = await execute(query, params);
    return response.rows;
};

module.exports.getPsikologDataList = async function(limit, offset, keyword) {
    let query = "SELECT pd.*, count(*) OVER() AS full_count" +
        " FROM psikolog_data pd JOIN konselink_user ku ON user_id = id";
    if (keyword) {
        keyword = "(\'%" + keyword + "%\')";
        query += " where lower(fullname) like lower" + keyword;
    }
    query += " ORDER BY user_id LIMIT $1 OFFSET $2";

    let params = [limit, offset];
    let response = await execute(query, params);
    return response.rows;
};

module.exports.getKlienRequestList = async function(limit, offset, keyword, psikologId) {
    let query = "SELECT kd.name, kd.has_display_picture, ps.*, count(*) OVER() AS full_count" +
        " FROM klien_data kd JOIN konselink_user ku ON user_id = id" +
        " JOIN psikolog_schedule ps ON user_id = klien_id" +
        " WHERE psikolog_id = $3 AND is_approved = false";
    if (keyword) {
        keyword = "(\'%" + keyword + "%\')";
        query += " and lower(kd.name) like lower" + keyword;
    }
    query += " ORDER BY user_id LIMIT $1 OFFSET $2";

    let params = [limit, offset, psikologId];
    let response = await execute(query, params);
    return response.rows;
};

module.exports.getIcdCodeList = async function (limit, offset, keyword) {
    let query = "SELECT *, count(*) OVER() AS full_count FROM diagnosis_codes"
    if (keyword) {
        keyword = "(\'%" + keyword + "%\')";
        query += " WHERE lower(disorder) like lower" + keyword;
    }
    query += " ORDER BY id LIMIT $1 OFFSET $2";
    let params = [limit, offset];
    let response = await execute(query, params);
    return response.rows;
};

module.exports.getPsikologUpcomingSchedule = async function(limit, offset, psikologId) {
    let currentTimestamp = new Date().toISOString() + "+7:00";
    let query = "SELECT ps.*, ku.name, count(*) OVER() AS full_count" +
        " FROM psikolog_schedule ps JOIN konselink_user ku ON klien_id = ku.id" +
        " WHERE psikolog_id = $1 AND start_times > $2 AND is_approved = true ORDER BY start_times LIMIT $3 OFFSET $4"
    let params = [psikologId, currentTimestamp, limit, offset];
    let response = await execute(query, params);
    return response.rows;
};

module.exports.getKlienUpcomingSchedule = async function(limit, offset, psikologId) {
    let currentTimestamp = new Date().toISOString() + "+7:00";
    let query = "SELECT ps.*, ku.name, count(*) OVER() AS full_count" +
        " FROM psikolog_schedule ps JOIN konselink_user ku ON psikolog_id = ku.id" +
        " WHERE klien_id = $1 AND start_times > $2 AND is_approved = true ORDER BY start_times LIMIT $3 OFFSET $4"
    let params = [psikologId, currentTimestamp, limit, offset];
    let response = await execute(query, params);
    return response.rows;
};

module.exports.getPsikologOngoingSchedule = async function(psikologId) {
    let currentTimestamp = new Date().toISOString() + "+7:00";
    let query = "SELECT ps.*, ku.name FROM psikolog_schedule ps JOIN konselink_user ku ON klien_id = ku.id" +
        " WHERE psikolog_id = $1 AND start_times <= $2 AND end_times >= $2 AND is_approved = true AND is_done = false";
    let params = [psikologId, currentTimestamp];
    let response = await execute(query, params);

    return getObject(response.rows);
}

module.exports.getKlienOngoingSchedule = async function(klienId) {
    let currentTimestamp = new Date().toISOString() + "+7:00";
    let query = "SELECT ps.*, ku.name FROM psikolog_schedule ps JOIN konselink_user ku ON psikolog_id = ku.id" +
        " WHERE klien_id = $1 AND start_times <= $2 AND end_times >= $2 AND is_approved = true AND is_done = false";
    let params = [klienId, currentTimestamp];
    let response = await execute(query, params);

    return getObject(response.rows);
};

module.exports.getPsikologDataById = async function(userId) {
    let query = "SELECT pd.*, has_display_picture" +
        " FROM psikolog_data pd JOIN konselink_user ku ON user_id = id WHERE user_id = $1";
    let params = [userId];
    let response = await execute(query, params);

    return getObject(response.rows);
};

module.exports.getPsikologScheduleById = async function(userId) {
    let currentTime = new Date().toISOString() + "+7:00";
    let query = " SELECT * FROM psikolog_schedule WHERE psikolog_id = $1 AND klien_id is null" +
        " AND start_times > $2";
    let params = [userId, currentTime];
    let response = await execute(query, params);
    return response.rows;
};

module.exports.updateProfile = async function (userId, konselingRole, hasDisplayPicture, name) {
    let table = konselingRole + "_data";
    let query = "UPDATE " + table + " SET ";
    let updateColumns = [];

    if (hasDisplayPicture !== undefined) {
        updateColumns.push("has_display_picture = " + hasDisplayPicture)
    }
    if (name !== undefined) {
        updateColumns.push("name = \'" + name + "\'");
    }
    if (updateColumns.length === 0) {
        return true;
    }
    query += updateColumns.join(",");
    query += " WHERE user_id = $1"

    let params = [userId];
    await execute(query, params);
};

module.exports.approveClientRequest = async function (requestId) {
    let query = "UPDATE psikolog_schedule SET is_approved = true WHERE id = $1";
    let params = [requestId];
    await execute(query, params);
};

module.exports.rejectClientRequest = async function (requestId) {
    let query = "UPDATE psikolog_schedule SET klien_id = null WHERE id = $1 AND is_approved = false";
    let params = [requestId];
    await execute(query, params);
};

module.exports.deleteSchedule = async function (scheduleId) {
    let query = "DELETE FROM psikolog_schedule WHERE id = $1 AND klien_id is null";
    let params = [scheduleId];
    await execute(query, params);
};

module.exports.verifyUser = async function (userId, konselingRole) {
    let table = konselingRole + "_data"
    let query = "UPDATE " + table + " SET is_verified = true WHERE user_id = $1";
    let params = [userId];
    await execute(query, params);
};

module.exports.getSenderChatHistoryFromGivenTimestamp = async function(scheduleId, timestamp){
    let query = "SELECT * FROM konselink_chat WHERE schedule_id = $1 ";
    let params = [scheduleId];
    if (timestamp !== undefined) {
        query += "AND timestamp > $2";
        params.push(timestamp);
    }
    let response = await execute(query, params);

    return response.rows;
};

module.exports.getPreConsultationSurveyByScheduleId = async function (scheduleId) {
    let query = "SELECT * FROM preconsultation_survey WHERE schedule_id = $1";
    let params = [scheduleId];
    let response = await execute(query, params);

    return response.rows;
};

module.exports.getKlienRecordByKlienId = async function (klienId) {
    let query = "SELECT kr.*, pd.fullname, ps.psikolog_id, dc.*" +
        " FROM klien_record kr JOIN psikolog_schedule ps ON kr.schedule_id = ps.id" +
        " JOIN diagnosis_codes dc ON kr.diagnosis_code = dc.id" +
        " LEFT JOIN psikolog_data pd ON ps.psikolog_id = pd.user_id WHERE ps.klien_id = $1";
    let params = [klienId];
    let response = await execute(query, params);

    return response.rows;
};

module.exports.getRegistrationSurveyData = async function (klienId, questionType) {
    let query = "SELECT answer_key, answer_value FROM registration_survey WHERE klien_id = $1 AND question_type = $2"
    let params = [klienId, questionType];
    let response = await execute(query, params);

    return response.rows;
};

module.exports.getKlienDataByKlienId = async function (klienId) {
    let query = "SELECT * FROM klien_data where user_id = $1";
    let params = [klienId];
    let response = await execute(query, params);

    return getObject(response.rows);
};

module.exports.getKlienParentsDataByKlienId = async function (klienId) {
    let query = "SELECT * FROM klien_parents_data where user_id = $1";
    let params = [klienId];
    let response = await execute(query, params);

    return response.rows;
};

module.exports.getKlienSiblingsDataByKlienId = async function (klienId) {
    let query = "SELECT * FROM klien_siblings_data where user_id = $1";
    let params = [klienId];
    let response = await execute(query, params);

    return response.rows;
};

module.exports.updateScheduleDone = async function (scheduleId) {
    let query = "UPDATE psikolog_schedule SET is_done = true WHERE id = $1";
    let params = [scheduleId];
    await execute(query, params);
};

module.exports.getPeriodicalData = async function (startTime, endTime) {
    let query = "SELECT kr.*, ps.start_times, ps.end_times, kup.name as psikolog_name, " +
        "kup.npm as psikolog_npm, kuk.name as klien_name, kuk.npm as klien_npm, dc.*, ps.id as schedule_id " +
        "FROM psikolog_schedule ps " +
        "JOIN klien_record kr ON ps.id = kr.schedule_id " +
        "JOIN konselink_user kup ON ps.psikolog_id = kup.id " +
        "JOIN konselink_user kuk ON ps.klien_id = kuk.id " +
        "LEFT JOIN diagnosis_codes dc ON kr.diagnosis_code = dc.id " +
        "WHERE ps.start_times >= $1 AND ps.end_times <= $2";
    let params = [startTime, endTime];
    let response = await execute(query, params);

    return response.rows;
}