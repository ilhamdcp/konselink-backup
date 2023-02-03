const query = require('../database/query');
const constant = require('../constant');
const core = require('../core/profileCore');
const validator = require('../validator/profileValidator');

const getResponse = function (user, konselingRole) {
    if (Object.keys(user).length === 0) {
        return constant.USER_NOT_FOUND;
    } else {
        return {
            user: core.mapBasicUserInfo(user, konselingRole),
            code: 200
        };
    }
};

const updateProfile = async function(req, res, user, konselingRole) {
    if (Object.keys(user).length === 0) {
        res.status(constant.USER_NOT_FOUND.code).json(constant.USER_NOT_FOUND);
    } else {
        let { hasDisplayPicture, name } = validator.validateUpdateProfileParams(req.body.hasDisplayPicture, req.body.name, konselingRole);
        await query.updateProfile(user.id, konselingRole, hasDisplayPicture, name);

        res.status(200).json({
            code: 200,
            message: "Successfully updated profile"
        });
    }
};

module.exports.basicKlienInfo = async function (req, res) {
    try {
        let user = await query.getKlienUserById(req.decodedToken.userId);
        let response = getResponse(user, constant.konselingRole.KLIEN);
        res.status(response.code).json(response);
    } catch (err) {
        console.log("Error on profile when basicKlienInfo, error: " , err);
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.basicPsikologInfo = async function (req, res) {
    try {
        let user = await query.getPsikologUserById(req.decodedToken.userId);
        let response = getResponse(user, constant.konselingRole.PSIKOLOG);
        res.status(response.code).json(response);
    } catch (err) {
        console.log("Error on profile when basicKlienInfo, error: " , err);
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.updateKlienProfile = async function (req, res) {
    try {
        let user = await query.getKlienUserById(req.decodedToken.userId);
        await updateProfile(req, res, user, constant.konselingRole.KLIEN);
    } catch (err) {
        console.log("Error on profile when updateKlienProfile, error: " , err);
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.updatePsikologProfile = async function (req, res) {
    try {
        let user = await query.getPsikologUserById(req.decodedToken.userId);
        await updateProfile(req, res, user, constant.konselingRole.PSIKOLOG);
    } catch (err) {
        console.log("Error on profile when updatePsikologProfile, error: " , err);
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};