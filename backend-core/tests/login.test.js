const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const mock = require('./mock/mock');
const constant = require('../constant');
const expect = chai.expect;
const ssoInfoParser = require('../core/sso-ui').ssoInfoParser;
const loginController = require('../controller/loginController');

chai.use(chaiHttp);
chai.should();

describe('Login test', function () {
    describe('when get login', function () {
        it('should return 200', function (done) {
            chai.request(app)
                .get('/login')
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('when login with existing user', function () {
        before(async function () {
            await mock.insertUserTesting();
        })
        it('should return token', function (done) {
            let data = ssoInfoParser(mock.ssoLogin);
            loginController.loginSSO(data, constant.konselingRole.PSIKOLOG).then(function (result) {
                expect(result.code).to.equal(200);
                expect(result.token).to.not.be.undefined;
                done();
            })
        });
        after(async function () {
            await mock.deleteUserTesting();
        });
    })
});