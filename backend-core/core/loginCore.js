const constant = require('../constant');

module.exports.mapLoginMahasiswa = function (data) {
    return {
        username: data.username,
        login_type: constant.loginType.SSO,
        name: data.name,
        npm: data.npm,
        fakultas: data.faculty,
        program_studi: data.study_program,
        program_edukasi: data.educational_program,
        user_role: constant.userSSORole.MAHASISWA,
    }
};

module.exports.mapLoginPsikolog = function (data) {
    return {
        username: data.username,
        login_type: constant.loginType.SSO,
        nip: data.nip,
        user_role: constant.userSSORole.STAFF,
    }
};