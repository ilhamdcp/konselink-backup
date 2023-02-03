const router = require('express').Router();
const controller = require('../controller/chatController');
const verifyToken = require('../utils/token').verifyToken;

router.get('/history', verifyToken, controller.getHistory);

router.post('/submit_survey', verifyToken, controller.submitSurvey);

router.post('/submit_record', verifyToken, controller.submitRecord);

router.get('/get_survey/:scheduleId', verifyToken, controller.getSurvey);

router.get('/get_record/:klienId', verifyToken, controller.getRecord);

module.exports = router;