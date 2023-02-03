const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const mock = require('./mock/mock');
const expect = chai.expect;

chai.use(chaiHttp);
chai.should();

describe("Chat History Test", function () {
    describe("When param scheduleId doesnt exists or incorrect", function () {
        it("should return bad request", function (done) {
            let token = mock.generateToken(10);
            chai.request(app)
                .get('/chat/history')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });
    });
    describe("When param is correct without timestamp", function () {
        before(async function () {
            await mock.insertUserTesting();
            await mock.insertPsikologSchedule();
            await mock.insertChatHistoryData();
        });
        it("should return 200 with chat history", function (done) {
            let token = mock.generateToken(10);
            chai.request(app)
                .get('/chat/history?scheduleId=10')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.chat.length).to.greaterThan(0);
                    done();
                });
        });
    });
    describe("When param is correct with timestamp", function () {
        it("should return 200 without chat history", function (done) {
            let token = mock.generateToken(10);
            let timestamp = new Date().toISOString();
            chai.request(app)
                .get('/chat/history?scheduleId=10&timestamp=' + timestamp)
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.chat.length).to.be.equal(0);
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting();
        });
    });
});
describe("Preconsultation Survey Test", function () {
    describe("When param is not valid", function () {
        it("should return bad request", function (done) {
            let token = mock.generateToken(10);
            chai.request(app)
                .post('/chat/submit_survey')
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
            await mock.insertPsikologSchedule();
        });
        it("should return success", function (done) {
            let token = mock.generateToken(10);
            chai.request(app)
                .post('/chat/submit_survey')
                .send({scheduleId: 10, survey: [{answerKey: "kuat", answerValue: 6}]})
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting();
        });
    });
});
describe("Submit Record Test", function () {
    describe("When param is not valid", function () {
        it("should return bad request", function (done) {
            let token = mock.generateToken(10);
            chai.request(app)
                .post('/chat/submit_record')
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
            await mock.insertPsikologSchedule();
        });
        it("should return Success", function (done) {
            let token = mock.generateToken(10);
            chai.request(app)
                .post('/chat/submit_record')
                .set('Authorization', 'Bearer ' + token)
                .send(require('./mock/data/record-data-request.json'))
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting();
        });
    });
});
describe("Get Survey Test", function () {
    describe("When param is not valid", function () {
        it("should return bad request", function (done) {
            let token = mock.generateToken(10);
            chai.request(app)
                .get('/chat/get_survey/asd')
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
            await mock.insertPsikologSchedule();
            await mock.insertPreconsultationSurvey();
        })
        it("should return survey data", function (done) {
            let token = mock.generateToken(10);
            chai.request(app)
                .get('/chat/get_survey/10')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.result).to.not.be.undefined;
                    expect(res.body.result.length).to.greaterThan(0);
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting();
        })
    });
});
describe("Get Record Test", function () {
    describe("When param is not valid", function () {
        it("should return bad request", function (done) {
            let token = mock.generateToken(10);
            chai.request(app)
                .get('/chat/get_record/asd')
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
            await mock.insertPsikologScheduleWithKlienId();
            await mock.insertKlienRecord();
        })
        it("should return record data", function (done) {
            let token = mock.generateToken(10);
            chai.request(app)
                .get('/chat/get_record/10')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.record).to.not.be.undefined;
                    expect(res.body.record.length).to.greaterThan(0);
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting();
        })
    });
});