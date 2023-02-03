const router = require('express').Router();
const controller = require('../controller/registerController');
const verifyToken = require('../utils/token').verifyToken;

router.post('/klien', verifyToken, controller.registerKlien);

router.post('/psikolog', verifyToken, controller.registerPsikolog);

router.post('/submit_survey', verifyToken, controller.submitSurvey);

router.get('/get_survey', verifyToken, controller.getSurvey);

router.get('/get_klien_data/:klienId', verifyToken, controller.getKlienData);

module.exports = router;