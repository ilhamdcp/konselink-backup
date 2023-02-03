const router = require('express').Router();
const controller = require('../controller/listController');
const verifyToken = require('../utils/token').verifyToken;

router.get('/psikolog', verifyToken, controller.getPsikologList);

router.get('/klien', verifyToken, controller.getKlienRequestList);

router.get('/schedule/klien/upcoming', verifyToken, controller.getKlienUpcomingSchedule);

router.get('/schedule/psikolog/upcoming', verifyToken, controller.getPsikologUpcomingSchedule);

router.get('/icd_codes', verifyToken, controller.getIcdCodes)

module.exports = router;