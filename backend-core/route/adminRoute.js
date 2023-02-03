const router = require('express').Router();
const controller = require('../controller/adminController');
const verifyToken = require('../utils/token').verifyToken;

router.post('/login', controller.loginAdmin);

router.get('/list/psikolog', verifyToken, controller.getPsikologList);

router.get('/list/klien', verifyToken, controller.getListKlien);

router.put('/verify/psikolog/:counselorId', verifyToken, controller.verifyPsikolog);

router.put('/verify/klien/:clientId', verifyToken, controller.verifyKlien);

router.get('/download', controller.adminDownloadData);

module.exports = router;