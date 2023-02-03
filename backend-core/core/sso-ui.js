const CASAuthentication = require('cas-authentication');
const additional_info = require('./additional_info.json');
const constant = require('../constant');

module.exports.cas = new CASAuthentication({
    cas_url: "https://sso.ui.ac.id/cas2",
    service_url: process.env.SERVICE_URL,
    cas_version: '2.0',
    session_name: constant.SSO_SESSION,
    session_info: constant.SSO_SESSION_INFO
});

module.exports.ssoInfoParser =  function(req) {
    if (req.session[constant.SSO_SESSION]) {
        const session_info = req.session[constant.SSO_SESSION_INFO];
        const userInfo = {};

        userInfo.username = req.session[constant.SSO_SESSION].toLowerCase();
        userInfo.name = session_info.nama;
        userInfo.user_role = session_info.peran_user;

        if (userInfo.user_role === 'mahasiswa') {
            const org_code = session_info.kd_org;
            const info = additional_info[org_code];

            userInfo.npm = session_info.npm;
            userInfo.faculty = info.faculty;
            userInfo.study_program = info.study_program;
            userInfo.educational_program = info.educational_program;

        } else if (userInfo.role === 'staff') {
            userInfo.nip = session_info.nip;
        }
        try {
            req.session.destroy();
        } catch (e) {
            req.session = null;
        }
        return userInfo;
    }
};
