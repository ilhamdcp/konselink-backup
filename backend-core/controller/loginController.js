const ssoInfoParser = require( '../core/sso-ui').ssoInfoParser;
const core = require('../core/loginCore');
const query = require('../database/query');
const tokenUtils = require('../utils/token');
const constant = require('../constant');

module.exports.login = async function (req, res) {
    let result = await loginSSO(ssoInfoParser(req));
    res.status(result.code).json(result);
};

const loginSSO = async function (data) {
    try {
        let user = await query.getUserByUsernameAndLoginType(data.username, constant.loginType.SSO);

        if (Object.keys(user).length === 0) {
            let mappedData;
            if (data.npm) {
                mappedData = core.mapLoginMahasiswa(data);
            }
            else {
                mappedData = core.mapLoginPsikolog(data);
            }
            await query.insertJSONData(mappedData, constant.table.KONSELINK_USER);
            user = await query.getUserByUsernameAndLoginType(data.username, constant.loginType.SSO);
        }

        let token = tokenUtils.generateToken(user.id);
        let code = 200;
        return { token, code };
    } catch (err) {
        console.log("Error on login when loginSSO, error: " , err);
        return constant.INTERNAL_ERROR;
    }
};

module.exports.loginSSO = loginSSO;