const router = require('express').Router();
const controller = require('../controller/profileController');
const verifyToken = require('../utils/token').verifyToken;

router.get('/basic_info/psikolog', verifyToken, controller.basicPsikologInfo);

router.get('/basic_info/klien', verifyToken, controller.basicKlienInfo);

router.put('/update/psikolog', verifyToken, controller.updatePsikologProfile);

router.put('/update/klien', verifyToken, controller.updateKlienProfile);

module.exports = router;