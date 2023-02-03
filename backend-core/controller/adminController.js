const listCore = require('../core/listCore');
const core = require('../core/adminCore');
const validator = require('../validator/adminValidator');
const constant = require('../constant');
const query = require('../database/query');
const bcrypt = require('bcryptjs');
const tokenUtils = require('../utils/token');

module.exports.loginAdmin = async function (req, res) {
    try {
        let username = req.body.username;
        let password = req.body.password;
        let adminUser = await query.getUserById(constant.ADMIN_ID);

        if (username === adminUser.username && bcrypt.compareSync(password, adminUser.password)) {
            let token = tokenUtils.generateToken(constant.ADMIN_ID);
            res.status(200).json({
                code: 200,
                token: token
            })
        } else {
            res.status(constant.UNAUTHORIZED.code).json(constant.UNAUTHORIZED);
        }
    } catch (err) {
        console.log("Error on admin when login, error: " , err);
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }

}

module.exports.getListKlien = async function (req, res) {
    try {
        let { entrySize, pageNo, keyword, isVerified } = validator.validateAdminListParams(req.query.entrySize,
                                                            req.query.pageNo, req.query.keyword, req.query.isVerified);
        let offset = (pageNo - 1) * entrySize;
        let klienData = await query.getAdminKlienDataList(entrySize, offset, keyword, isVerified);
        let mappedKlienData = await core.mapListKlien(klienData);

        res.status(200).json({
            code: 200,
            data: mappedKlienData,
            pageNo: parseInt(pageNo),
            totalPage: listCore.getTotalPage(klienData, entrySize)
        });
    } catch (err) {
        console.log("Error on admin when getListKlien, error: " , err);
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.getPsikologList = async function (req, res) {
    try {
        let { entrySize, pageNo, keyword, isVerified } = validator.validateAdminListParams(req.query.entrySize,
                                                            req.query.pageNo, req.query.keyword, req.query.isVerified);
        let offset = (pageNo - 1) * entrySize;
        let users = await query.getAdminPsikologDataList(entrySize, offset, keyword, isVerified);
        let mappedUsers = await core.mapListPsikolog(users);

        res.status(200).json({
            code: 200,
            data: mappedUsers,
            pageNo: parseInt(pageNo),
            totalPage: listCore.getTotalPage(users, entrySize)
        });
    } catch (err) {
        console.log("Error on admin when getPsikologList, error: " , err);
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

const verifyUser = async function(req, res, user, konselingRole) {
    if (Object.keys(user).length === 0) {
        res.status(constant.USER_NOT_FOUND.code).json(constant.USER_NOT_FOUND);
    } else {
        await query.verifyUser(user.user_id, konselingRole);
        res.status(200).json({
            code: 200,
            message: "Successfully verify user!"
        })
    }
};

module.exports.verifyKlien = async function (req, res) {
    try {
        let klienId = req.params.clientId;
        let user = await query.getKlienUserById(klienId);
        await verifyUser(req, res, user, constant.konselingRole.KLIEN);
    } catch (err) {
        console.log("Error on admin when verifyKlien, error: " , err);
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.verifyPsikolog = async function (req, res) {
    try {
        let klienId = req.params.counselorId;
        let user = await query.getPsikologUserById(klienId);
        await verifyUser(req, res, user, constant.konselingRole.PSIKOLOG);
    } catch (err) {
        console.log("Error on admin when verifyPsikolog, error: " , err);
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
};

module.exports.adminDownloadData = async function (req, res) {
    try {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        let isValid = validator.validateAdminDownloadDataParam(startDate, endDate);

        if (!isValid) {
            res.status(constant.BAD_REQUEST.code).json(constant.BAD_REQUEST);
        } else {
            let filename = "Konselink-Data " + startDate.split("/").join("-") + " " + endDate.split("/").join("-") + ".xlsx";
            let excel = await core.generateExcel(startDate, endDate);
            excel.write(filename, res);
        }
    } catch (err) {
        console.log("Error on admin when adminDownload, error: " , err);
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
}