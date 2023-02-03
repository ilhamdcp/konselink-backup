const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const mock = require('./mock/mock');
const expect = chai.expect;

chai.use(chaiHttp);
chai.should();

describe('Register Klien', function () {
    describe('when mock data is not correct', function () {
        it('should return 400', function (done) {
            let token = require('../utils/token').generateToken(0);
            chai.request(app)
                .post('/register/klien')
                .set('Authorization', 'Bearer ' + token)
                .send({fullname: 0})
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });
    });
    describe('when mock data is correct', function () {
        before(async function () {
            await mock.insertUserTesting();
        });
        it('should return 200', function (done) {
            let token = require('../utils/token').generateToken(mock.userTesting.id);
            chai.request(app)
                .post('/register/klien')
                .set('Authorization', 'Bearer ' + token)
                .send(require('./mock/data/klien-data.json'))
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
    describe('when data is already inserted (duplicate)', function () {
        it('should return 500', function (done) {
            let token = require('../utils/token').generateToken(mock.userTesting.id);
            chai.request(app)
                .post('/register/klien')
                .set('Authorization', 'Bearer ' + token)
                .send(require('./mock/data/klien-data.json'))
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting();
        });
    });
});

describe('Register Psikolog', function () {
    describe('when mock data is not correct', function () {
        it('should return 400', function (done) {
            let token = require('../utils/token').generateToken(0);
            chai.request(app)
                .post('/register/psikolog')
                .set('Authorization', 'Bearer ' + token)
                .send({name: 0})
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });
    });
    describe('when mock data is correct', function () {
        before(async function () {
            await mock.insertUserTesting();
        });
        it('should return 200', function (done) {
            let token = require('../utils/token').generateToken(mock.userTesting.id);
            chai.request(app)
                .post('/register/psikolog')
                .set('Authorization', 'Bearer ' + token)
                .send(require('./mock/data/psikolog-data-request.json'))
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
    describe('when data is already inserted (duplicate)', function () {
        it('should return 500', function (done) {
            let token = require('../utils/token').generateToken(mock.userTesting.id);
            chai.request(app)
                .post('/register/psikolog')
                .set('Authorization', 'Bearer ' + token)
                .send(require('./mock/data/psikolog-data-request.json'))
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting();
        });
    });
});
describe("Registration Submit Survey", function () {
    describe("when params is invalid", function () {
        it("should return bad request", function (done) {
            let token = mock.generateToken(10);
            chai.request(app)
                .post('/register/submit_survey')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    done();
                })
        });
    });
    describe("when param is valid", function () {
        before(async function () {
            await mock.insertUserTesting();
        });
        it("should return success", function (done) {
            let token = mock.generateToken(10);
            chai.request(app)
                .post('/register/submit_survey')
                .set('Authorization', 'Bearer ' + token)
                .send(require('./mock/data/registration-survey-request.json'))
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                })
        });
        after(async function () {
            await mock.deleteUserTesting();
        });
    });
});
describe("Get Registration Survey", function () {
    describe("When param is not valid", function () {
        it("should return bad request", function (done) {
            let token = mock.generateToken(10);
            chai.request(app)
                .get('/register/get_survey')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });
    });
    describe("When param is valid", function () {
        before(async function () {
            await mock.insertUserTesting();
            await mock.insertRegistrationSurvey();
        })
        it("should return SRQ record data", function (done) {
            let token = mock.generateToken(10);
            chai.request(app)
                .get('/register/get_survey?clientId=10&questionType=SRQ')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.result.answerYesMoreThanSix).to.be.false;
                    done();
                });
        });
        it("should return IPIP record data", function (done) {
            let token = mock.generateToken(10);
            chai.request(app)
                .get('/register/get_survey?clientId=10&questionType=IPIP')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.result).to.not.be.undefined;
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting();
        })
    });
});
describe("Get Klien Data", function () {
    describe("when param is invalid", function () {
        it("should return bad request", function (done) {
            let token = mock.generateToken(10);
            chai.request(app)
                .get('/register/get_klien_data/asd')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });
    });
    describe("When param is valid", function () {
        before(async function () {
            await mock.insertUserTesting();
            await mock.insertKlienData();
        })
        it("should return klien data", function (done) {
            let token = mock.generateToken(10);
            chai.request(app)
                .get('/register/get_klien_data/10')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(mock.verifyGetKlienData(res.body.data)).to.be.true;
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting();
        })
    });
});