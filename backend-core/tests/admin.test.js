const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const mock = require('./mock/mock');
const expect = chai.expect;

chai.use(chaiHttp);
chai.should();

describe('Admin List Klien', function () {
    describe('when token is correct and no query params', function () {
        before(async function () {
            await mock.insertUserTesting();
            await mock.insertEmptyKlienData();
        });
        it ('should return list of psikolog, pageNo and totalPage',  function (done) {
            let token = require('../utils/token').generateToken(1);
            chai.request(app)
                .get('/admin/list/klien')
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
        after(async function () {
            await mock.deleteUserTesting();
        })
    });
    describe('when token is correct with query params', function () {
        it('should return correct pageNo', function (done) {
            let token = require('../utils/token').generateToken(1);
            chai.request(app)
                .get('/admin/list/klien?pageNo=1&entrySize=1&keyword=a&isVerified=true')
                .set('Authorization', token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.pageNo).to.not.be.undefined;
                    expect(res.body.totalPage).to.not.be.undefined;
                    expect(res.body.pageNo).to.equal(1);
                    done();
                });
        });
    });
});
describe('Admin List Psikolog', function () {
    describe('when token is correct and no query params', function () {
        before(async function () {
            await mock.insertUserTesting();
            await mock.insertEmptyPsikologData();
        });
        it ('should return list of psikolog, pageNo and totalPage',  function (done) {
            let token = require('../utils/token').generateToken(1);
            chai.request(app)
                .get('/admin/list/psikolog')
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
        after(async function () {
            await mock.deleteUserTesting();
        })
    });
    describe('when token is correct with query params', function () {
        it('should return correct pageNo', function (done) {
            let token = require('../utils/token').generateToken(1);
            chai.request(app)
                .get('/admin/list/psikolog?pageNo=1&entrySize=1&keyword=a&isVerified=true')
                .set('Authorization', token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.pageNo).to.not.be.undefined;
                    expect(res.body.totalPage).to.not.be.undefined;
                    expect(res.body.pageNo).to.equal(1);
                    done();
                });
        });
    });
});
describe('Verify Klien', function () {
    describe('when user is not found', function () {
        it('should return not found', function (done) {
            let token = require('../utils/token').generateToken(0);
            chai.request(app)
                .put('/admin/verify/klien/0')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    done();
                });
        });
    });
    describe('when user is exists', function () {
        before(async function () {
            await mock.insertUserTesting();
            await mock.insertEmptyKlienData();
        });
        it('should return success', function (done) {
            let token = require('../utils/token').generateToken(0);
            chai.request(app)
                .put('/admin/verify/klien/10')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting();
        })
    })
});
describe('Login Admin', function () {
    describe('When username and password incorrect', function () {
        it('should return unauthorized', function (done) {
            chai.request(app)
                .post('/admin/login')
                .end(function (err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
        });
    });
    describe('When username and password correct', function () {
        it('should return token', function (done) {
            chai.request(app)
                .post('/admin/login')
                .send({
                    username: process.env.ADMIN_USERNAME,
                    password: process.env.ADMIN_PASSWORD
                })
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.token).to.not.undefined;
                    done();
                });
        });
    });
});

describe('Admin Download', function () {
    describe('When param is not valid', function () {
        it('should return bad request', function (done) {
            let token = require('../utils/token').generateToken(0);
            chai.request(app)
                .get('/admin/download')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });
    });
    describe('When param is valid', function () {
        it('should return download excel data', function (done) {
            let token = require('../utils/token').generateToken(0);
            chai.request(app)
                .get('/admin/download?startDate=25/5/2020&endDate=31/5/2020')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.type).to.contain("sheet");
                    done();
                });
        });
    });
});