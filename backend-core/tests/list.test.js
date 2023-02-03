const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const mock = require('./mock/mock');
const userTesting = mock.userTesting;
const expect = chai.expect;

chai.use(chaiHttp);
chai.should();

describe('psikolog list test', function () {
    describe('when token is correct and no query params', function () {
        it ('should return list of psikolog, pageNo and totalPage',  function (done) {
            let token = require('../utils/token').generateToken(userTesting.id);
            chai.request(app)
                .get('/list/psikolog')
                .set('Authorization', token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.not.be.undefined;
                    expect(res.body.data.length).to.be.greaterThan(0);
                    expect(res.body.pageNo).to.not.be.undefined;
                    expect(res.body.totalPage).to.not.be.undefined;
                    done();
                });
        });
    });
    describe('when token is correct with query params', function () {
        it('should return correct pageNo', function (done) {
            let token = require('../utils/token').generateToken(userTesting.id);
            chai.request(app)
                .get('/list/psikolog?pageNo=2&entrySize=1&keyword=a')
                .set('Authorization', token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.pageNo).to.not.be.undefined;
                    expect(res.body.totalPage).to.not.be.undefined;
                    expect(res.body.pageNo).to.equal(2);
                    done();
                });
        });
    });
    describe('when token is incorrect', function () {
        it ('should return 401', function (done) {
            let token = "";
            chai.request(app)
                .get('/list/psikolog')
                .set('Authorization', token)
                .end(function (err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        });
    });
});

describe('klien list test', function () {
    describe('when token is correct and no query params', function () {
        before(async function () {
            await mock.insertUserTesting();
            await mock.insertKlienData();
            await mock.insertPsikologScheduleWithKlienId();
        })
        it ('should return list of psikolog, pageNo and totalPage',  function (done) {
            let token = require('../utils/token').generateToken(10);
            chai.request(app)
                .get('/list/klien')
                .set('Authorization', token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.not.be.undefined;
                    expect(res.body.data.length).to.be.greaterThan(0);
                    expect(res.body.pageNo).to.not.be.undefined;
                    expect(res.body.totalPage).to.not.be.undefined;
                    done();
                });
        });
    });
    describe('when token is correct with query params', function () {
        it('should return correct pageNo', function (done) {
            let token = require('../utils/token').generateToken(10);
            chai.request(app)
                .get('/list/klien?pageNo=1&entrySize=1&keyword=a')
                .set('Authorization', token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.not.be.undefined;
                    expect(res.body.data.length).to.be.greaterThan(0);
                    expect(res.body.pageNo).to.not.be.undefined;
                    expect(res.body.totalPage).to.not.be.undefined;
                    expect(res.body.pageNo).to.equal(1);
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting();
        })
    });
    describe('when token is incorrect', function () {
        it ('should return 401', function (done) {
            let token = "";
            chai.request(app)
                .get('/list/klien')
                .set('Authorization', token)
                .end(function (err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        });
    });
});

describe('klien Upcoming Schedule', function () {
    describe('when token is correct and no query params', function () {
        before(async function () {
            await mock.insertUserTesting();
            await mock.insertUpcomingSchedule();
        });
        it ('should return list of psikolog, pageNo and totalPage',  function (done) {
            let token = require('../utils/token').generateToken(10);
            chai.request(app)
                .get('/list/schedule/klien/upcoming')
                .set('Authorization', token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.schedule).to.not.be.undefined;
                    expect(res.body.schedule.length).to.be.greaterThan(0);
                    expect(res.body.pageNo).to.not.be.undefined;
                    expect(res.body.totalPage).to.not.be.undefined;
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting();
        });
    });
    describe('when token is correct with query params', function () {
        before(async function () {
            await mock.insertUserTesting();
            await mock.insertUpcomingSchedule();
        });
        it ('should return correct pageNo',  function (done) {
            let token = require('../utils/token').generateToken(10);
            chai.request(app)
                .get('/list/schedule/klien/upcoming?pageNo=1&entrySize=1')
                .set('Authorization', token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.schedule).to.not.be.undefined;
                    expect(res.body.schedule.length).to.be.greaterThan(0);
                    expect(res.body.pageNo).to.not.be.undefined;
                    expect(res.body.totalPage).to.not.be.undefined;
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting();
        });
    });
});
describe('Psikolog Upcoming Schedule', function () {
    describe('when token is correct and no query params', function () {
        before(async function () {
            await mock.insertUserTesting();
            await mock.insertUpcomingSchedule();
        });
        it ('should return list of psikolog, pageNo and totalPage',  function (done) {
            let token = require('../utils/token').generateToken(10);
            chai.request(app)
                .get('/list/schedule/psikolog/upcoming')
                .set('Authorization', token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.schedule).to.not.be.undefined;
                    expect(res.body.schedule.length).to.be.greaterThan(0);
                    expect(res.body.pageNo).to.not.be.undefined;
                    expect(res.body.totalPage).to.not.be.undefined;
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting();
        });
    });
    describe('when token is correct with query params', function () {
        before(async function () {
            await mock.insertUserTesting();
            await mock.insertUpcomingSchedule();
        });
        it ('should return correct pageNo',  function (done) {
            let token = require('../utils/token').generateToken(10);
            chai.request(app)
                .get('/list/schedule/psikolog/upcoming?pageNo=1&entrySize=1')
                .set('Authorization', token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.schedule).to.not.be.undefined;
                    expect(res.body.schedule.length).to.be.greaterThan(0);
                    expect(res.body.pageNo).to.not.be.undefined;
                    expect(res.body.totalPage).to.not.be.undefined;
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting();
        });
    });
});
describe('Get Icd Code test', function () {
    describe('when token is correct and no query params', function () {
        it ('should return list of psikolog, pageNo and totalPage',  function (done) {
            let token = require('../utils/token').generateToken(10);
            chai.request(app)
                .get('/list/icd_codes')
                .set('Authorization', token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.icdCodes).to.not.be.undefined;
                    expect(res.body.icdCodes.length).to.be.greaterThan(0);
                    expect(res.body.pageNo).to.not.be.undefined;
                    expect(res.body.totalPage).to.not.be.undefined;
                    done();
                });
        });
    });
    describe('when token is correct with query params', function () {
        it ('should return correct pageNo',  function (done) {
            let token = require('../utils/token').generateToken(10);
            chai.request(app)
                .get('/list/icd_codes?pageNo=1&entrySize=1&keyword=insom')
                .set('Authorization', token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.icdCodes).to.not.be.undefined;
                    expect(res.body.icdCodes.length).to.be.greaterThan(0);
                    expect(res.body.pageNo).to.not.be.undefined;
                    expect(res.body.totalPage).to.not.be.undefined;
                    done();
                });
        });
    });
});