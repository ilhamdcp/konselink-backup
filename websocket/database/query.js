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

module.exports.updateDoneSchedule = async function (scheduleId) {
    let query = "UPDATE psikolog_schedule SET is_done = true WHERE id = $1";
    let params = [scheduleId];
    await execute(query, params);
};