const router = require('express').Router();
const controller = require('../controller/scheduleController');
const verifyToken = require('../utils/token').verifyToken;

router.put('/psikolog/approve/:requestId', verifyToken, controller.approveClientRequest);

router.put('/psikolog/reject/:requestId', verifyToken, controller.rejectClientRequest);

router.put('/klien/request/:scheduleId', verifyToken, controller.clientRequestSchedule);

router.get('/psikolog/list', verifyToken, controller.listPsikologSchedule);

router.post('/psikolog/create', verifyToken, controller.createPsikologSchedule);

router.put('/psikolog/delete/:scheduleId', verifyToken, controller.deletePsikologSchedule);

router.get('/psikolog/ongoing', verifyToken, controller.getPsikologOngoingSchedule);

router.get('/klien/ongoing', verifyToken, controller.getKlienOngoingSchedule);

module.exports = router;