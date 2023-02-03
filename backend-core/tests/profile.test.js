const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const mock = require('./mock/mock');
const expect = chai.expect;

chai.use(chaiHttp);
chai.should();

describe('Profile Basic Info', function () {
    describe('Psikolog', function () {
        describe('when token information is correct', function () {
            before(async function () {
                await mock.insertUserTesting();
            })
            it('should return correct profile', function (done) {
                let token = require('../utils/token').generateToken(mock.userTesting.id);
                chai.request(app)
                    .get('/profile/basic_info/psikolog')
                    .set('Authorization', 'Bearer ' + token)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body.user).to.not.be.undefined;
                        expect(res.body.user.username).to.equal(mock.userTesting.username);
                        done();
                    });
            });
            after(async function () {
                await mock.deleteUserTesting();
            })
        });

        describe('when user is not found', function () {
            it('should return not found', function (done) {
                let token = require('../utils/token').generateToken(0);
                chai.request(app)
                    .get('/profile/basic_info/psikolog')
                    .set('Authorization', 'Bearer ' + token)
                    .end(function (err, res) {
                        expect(res).to.have.status(404);
                        done();
                    });
            });
        });

        describe('when token is incorrect', function () {
            it('should return error', function (done) {
                let token = require('../utils/token').generateToken("");
                chai.request(app)
                    .get('/profile/basic_info/psikolog')
                    .set('Authorization', 'Bearer ' + token)
                    .end(function (err, res) {
                        expect(res).to.have.status(500);
                        done();
                    });
            });
        });
    });

    describe('klien', function () {
        describe('when token information is correct', function () {
            before(async function () {
                await mock.insertUserTesting();
            })
            it('should return correct profile', function (done) {
                let token = require('../utils/token').generateToken(mock.userTesting.id);
                chai.request(app)
                    .get('/profile/basic_info/klien')
                    .set('Authorization', 'Bearer ' + token)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body.user).to.not.be.undefined;
                        expect(res.body.user.username).to.equal(mock.userTesting.username);
                        done();
                    });
            });
            after(async function () {
                await mock.deleteUserTesting();
            })
        });

        describe('when user is not found', function () {
            it('should return not found', function (done) {
                let token = require('../utils/token').generateToken(0);
                chai.request(app)
                    .get('/profile/basic_info/klien')
                    .set('Authorization', 'Bearer ' + token)
                    .end(function (err, res) {
                        expect(res).to.have.status(404);
                        done();
                    });
            });
        });

        describe('when token is incorrect', function () {
            it('should return error', function (done) {
                let token = require('../utils/token').generateToken("");
                chai.request(app)
                    .get('/profile/basic_info/klien')
                    .set('Authorization', 'Bearer ' + token)
                    .end(function (err, res) {
                        expect(res).to.have.status(500);
                        done();
                    });
            });
        });
    })
});

describe('Profile Update Picture', function () {
    describe('Psikolog', function () {
        describe('when token information is correct', function () {
            before(async function () {
                await mock.insertUserTesting();
            })
            describe('with name param', function () {
                it('should return 200', function (done) {
                    let token = require('../utils/token').generateToken(mock.userTesting.id);
                    chai.request(app)
                        .put('/profile/update/psikolog')
                        .set('Authorization', 'Bearer ' + token)
                        .send({name: "testing2"})
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            done();
                        });
                });
            });
            describe('with hasDisplayPicture param', function () {
                it('should return 200', function (done) {
                    let token = require('../utils/token').generateToken(mock.userTesting.id);
                    chai.request(app)
                        .put('/profile/update/psikolog')
                        .set('Authorization', 'Bearer ' + token)
                        .send({hasDisplayPicture: true})
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            done();
                        });
                });
            });
            describe('without param', function () {
                it('should return 200', function (done) {
                    let token = require('../utils/token').generateToken(mock.userTesting.id);
                    chai.request(app)
                        .put('/profile/update/psikolog')
                        .set('Authorization', 'Bearer ' + token)
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            done();
                        });
                });
            });
            after(async function () {
                await mock.deleteUserTesting();
            })
        });

        describe('when user is not found', function () {
            it('should return not found', function (done) {
                let token = require('../utils/token').generateToken(0);
                chai.request(app)
                    .put('/profile/update/psikolog')
                    .set('Authorization', 'Bearer ' + token)
                    .end(function (err, res) {
                        expect(res).to.have.status(404);
                        done();
                    });
            });
        });

        describe('when token is incorrect', function () {
            it('should return error', function (done) {
                let token = require('../utils/token').generateToken("");
                chai.request(app)
                    .put('/profile/update/psikolog')
                    .set('Authorization', 'Bearer ' + token)
                    .end(function (err, res) {
                        expect(res).to.have.status(500);
                        done();
                    });
            });
        });
    });

    describe('Klien', function () {
        describe('when token information is correct', function () {
            before(async function () {
                await mock.insertUserTesting();
            });
            describe('with name param', function () {
                it('should return 200', function (done) {
                    let token = require('../utils/token').generateToken(mock.userTesting.id);
                    chai.request(app)
                        .put('/profile/update/klien')
                        .set('Authorization', 'Bearer ' + token)
                        .send({name: "testing2"})
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            done();
                        });
                });
            });
            describe('with hasDisplayPicture param', function () {
                it('should return 200', function (done) {
                    let token = require('../utils/token').generateToken(mock.userTesting.id);
                    chai.request(app)
                        .put('/profile/update/klien')
                        .set('Authorization', 'Bearer ' + token)
                        .send({hasDisplayPicture: true})
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            done();
                        });
                });
            });
            describe('without param', function () {
                it('should return 200', function (done) {
                    let token = require('../utils/token').generateToken(mock.userTesting.id);
                    chai.request(app)
                        .put('/profile/update/klien')
                        .set('Authorization', 'Bearer ' + token)
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            done();
                        });
                });
            });
            after(async function () {
                await mock.deleteUserTesting();
            });
        });

        describe('when user is not found', function () {
            it('should return not found', function (done) {
                let token = require('../utils/token').generateToken(0);
                chai.request(app)
                    .put('/profile/update/klien')
                    .set('Authorization', 'Bearer ' + token)
                    .end(function (err, res) {
                        expect(res).to.have.status(404);
                        done();
                    });
            });
        });

        describe('when token is incorrect', function () {
            it('should return error', function (done) {
                let token = require('../utils/token').generateToken("");
                chai.request(app)
                    .put('/profile/update/klien')
                    .set('Authorization', 'Bearer ' + token)
                    .end(function (err, res) {
                        expect(res).to.have.status(500);
                        done();
                    });
            });
        });
    })
});