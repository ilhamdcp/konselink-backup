const awsS3 = require('../utils/awsS3');

module.exports.mapBasicUserInfo = function (user, konselingRole) {
    return {
        id: user.id,
        username: user.username,
        academicId: user.npm !== null ? user.npm : user.nip,
        fakultas: user.fakultas,
        programStudi: user.program_studi,
        programEdukasi: user.program_edukasi,
        userRole: user.user_role,
        isVerified: user.is_verified === null ? false : user.is_verified,
        nickName: user.nick_name,
        fullName: user.name,
        isRegistered: user.user_id !== null,
        displayPictureUrl: user.has_display_picture ?
            awsS3.getDisplayPictureUrl(user.user_id, konselingRole) : null
    }
};