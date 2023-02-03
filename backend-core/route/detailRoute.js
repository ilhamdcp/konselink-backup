const router = require('express').Router();
const controller = require('../controller/detailController');
const verifyToken = require('../utils/token').verifyToken;

router.get('/psikolog/:userId', verifyToken, controller.getPsikologDetail);

module.exports = router;