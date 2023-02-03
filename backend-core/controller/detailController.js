const constant = require('../constant');
const query = require('../database/query');
const core = require('../core/detailCore');

module.exports.getPsikologDetail = async function (req, res) {
    try {
        let psikologDetailData = await query.getPsikologDataById(req.params.userId);
        let psikologSchedule = await query.getPsikologScheduleById(req.params.userId);

        if (Object.keys(psikologDetailData).length === 0) {
            res.status(constant.USER_NOT_FOUND.code).json(constant.USER_NOT_FOUND);
        } else {
            let detailResponse = core.mapDetailPsikologData(psikologDetailData, psikologSchedule);
            res.status(200).json({
                code: 200,
                data: detailResponse
            })
        }
    } catch (err) {
        console.log("Error on detail when getPsikologDetail, error: " , err);
        res.status(constant.INTERNAL_ERROR.code).json(constant.INTERNAL_ERROR);
    }
}