const router = require('express').Router();
const controller = require('../controller/loginController');
const ssoUiLogin = require('../core/sso-ui');

router.get('/login', ssoUiLogin.cas.bounce, controller.login);

module.exports = router;