const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const mock = require('./mock/mock');
const expect = chai.expect;

chai.use(chaiHttp);
chai.should();

describe('Schedule Approve Request', function () {
    describe('when token information is correct', function () {
        before(async function () {
            await mock.insertUserTesting();
            await mock.insertPsikologScheduleWithKlienId();
        })
        it('should return correct profile', function (done) {
            let token = require('../utils/token').generateToken(mock.userTesting.id);
            chai.request(app)
                .put('/schedule/psikolog/approve/10')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting();
        })
    });

    describe('when schedule is not found', function () {
        it('should return not found', function (done) {
            let token = require('../utils/token').generateToken(0);
            chai.request(app)
                .put('/schedule/psikolog/approve/0')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    done();
                });
        });
    });

    describe('when request id is incorrect', function () {
        it('should return error', function (done) {
            let token = require('../utils/token').generateToken(0);
            chai.request(app)
                .put('/schedule/psikolog/approve/asd')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });
    });
});

describe('Schedule Reject Request', function () {
    describe('when token information is correct', function () {
        before(async function () {
            await mock.insertUserTesting();
            await mock.insertPsikologScheduleWithKlienId();
        })
        it('should return correct profile', function (done) {
            let token = require('../utils/token').generateToken(mock.userTesting.id);
            chai.request(app)
                .put('/schedule/psikolog/reject/10')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting();
        })
    });

    describe('when schedule is not found', function () {
        it('should return not found', function (done) {
            let token = require('../utils/token').generateToken(0);
            chai.request(app)
                .put('/schedule/psikolog/reject/0')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    done();
                });
        });
    });

    describe('when request id is incorrect', function () {
        it('should return error', function (done) {
            let token = require('../utils/token').generateToken(0);
            chai.request(app)
                .put('/schedule/psikolog/reject/asd')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });
    });
});

describe('Klien Request Schedule', function () {
    describe('when param is invalid', function () {
        it('should return param invalid', function (done) {
            let token = require('../utils/token').generateToken(0);
            chai.request(app)
                .put('/schedule/klien/request/asd')
                .set('Authorization', 'Bearer ' + token)
                .send({})
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });
    });
    describe('when userId from token is not found', function () {
        it('should return not found', function (done) {
            let token = require('../utils/token').generateToken(0);
            chai.request(app)
                .put('/schedule/klien/request/0')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    done();
                });
        });
    });
    describe('when param is valid', function () {
        before(async function () {
            await mock.insertUserTesting();
            await mock.insertPsikologSchedule();
        });
        it('should return success', function (done) {
            let token = require('../utils/token').generateToken(10);
            chai.request(app)
                .put('/schedule/klien/request/10')
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

describe('List Psikolog Schedule', function () {
    describe('when param is not valid', function () {
        it('should return bad request', function (done) {
            let token = require('../utils/token').generateToken(10);
            chai.request(app)
                .get('/schedule/psikolog/list?month=asdasd')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });
    });
    describe('when param is valid and there is a schedule on a month', function () {
        before(async function () {
            await mock.insertUserTesting();
            await mock.insertApprovedPsikologSchedule();
        });
        it('should return a schedule', function (done) {
            let token = require('../utils/token').generateToken(10);
            let month = new Date().getMonth() + 1;
            let year = new Date().getFullYear();
            chai.request(app)
                .get('/schedule/psikolog/list?month='+month+'&year='+year)
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.schedule).to.not.be.undefined;
                    expect(res.body.schedule.length).to.be.equal(1);
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting();
        });
    });
    describe('when param is valid and there is no schedule on a month', function () {
        it('should return empty schedule', function (done) {
            let token = require('../utils/token').generateToken(10);
            chai.request(app)
                .get('/schedule/psikolog/list?month=4&year=2020')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.schedule.length).to.equal(0);
                    done();
                });
        });
    });
});

describe('Create Psikolog Schedule', function () {
    describe('when param is not valid', function () {
        it('should return bad request', function (done) {
            let token = require('../utils/token').generateToken(10);
            chai.request(app)
                .post('/schedule/psikolog/create')
                .set('Authorization', 'Bearer ' + token)
                .send({})
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });
    });
    describe('when param is valid and user is not found', function () {
        it('should return not found', function (done) {
            let token = require('../utils/token').generateToken(0);
            chai.request(app)
                .post('/schedule/psikolog/create')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    startDate: "1/4/2020",
                    endDate: "2/4/2020",
                    sessionNum: 2,
                    workDays: "1,2,3,4,5",
                    startTime: "09:00",
                    interval: 15
                })
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    done();
                });
        });
    });
    describe('when param is valid and user is exists', function () {
        before(async function () {
            await mock.insertUserTesting();
        });
        it('should return not success', function (done) {
            let token = require('../utils/token').generateToken(10);
            chai.request(app)
                .post('/schedule/psikolog/create')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    startDate: "1/4/2020",
                    endDate: "2/4/2020",
                    sessionNum: 2,
                    workDays: "1,2,3,4,5",
                    startTime: "09:00",
                    interval: 15
                })
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting();
        });
    });
    describe('when param is valid and user is exists and schedule is overlap', function () {
        before(async function () {
            await mock.insertUserTesting();
            await mock.insertPsikologSchedule();
        });
        it('should return not found', function (done) {
            let token = require('../utils/token').generateToken(10);
            chai.request(app)
                .post('/schedule/psikolog/create')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    startDate: "5/5/2020",
                    endDate: "6/5/2020",
                    sessionNum: 2,
                    workDays: "1,2,3,4,5",
                    startTime: "13:00",
                    interval: 15
                })
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
describe('Schedule Delete Request', function () {
    describe('when token information is correct', function () {
        before(async function () {
            await mock.insertUserTesting();
            await mock.insertPsikologScheduleWithKlienId();
        })
        it('should return correct profile', function (done) {
            let token = require('../utils/token').generateToken(mock.userTesting.id);
            chai.request(app)
                .put('/schedule/psikolog/delete/10')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting();
        })
    });

    describe('when schedule is not found', function () {
        it('should return not found', function (done) {
            let token = require('../utils/token').generateToken(0);
            chai.request(app)
                .put('/schedule/psikolog/delete/0')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    done();
                });
        });
    });

    describe('when request id is incorrect', function () {
        it('should return error', function (done) {
            let token = require('../utils/token').generateToken(0);
            chai.request(app)
                .put('/schedule/psikolog/delete/asd')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });
    });
});

describe('Psikolog Ongoing Schedule', function () {
    describe('when there is ongoing schedule', function () {
        before(async function () {
            await mock.insertUserTesting();
            await mock.insertOngoingSchedule();
        });
        it('should return non null value ongoing schedule', function (done) {
            let token = require('../utils/token').generateToken(10);
            chai.request(app)
                .get('/schedule/psikolog/ongoing')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.schedule.scheduleId).to.not.null;
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting();
        });
    });
    describe('when there is no ongoing schedule', function () {
        before(async function () {
            await mock.insertUserTesting();
        });
        it('should return null value ongoing schedule', function (done) {
            let token = require('../utils/token').generateToken(10);
            chai.request(app)
                .get('/schedule/psikolog/ongoing')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.schedule.scheduleId).to.be.null;
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting();
        });
    });
    describe('when token is not correct', function () {
        it('should return error', function (done) {
            let token = require('../utils/token').generateToken("asd");
            chai.request(app)
                .get('/schedule/psikolog/ongoing')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });
    });
});

describe('Klien Ongoing Schedule', function () {
    describe('when there is ongoing schedule', function () {
        before(async function () {
            await mock.insertUserTesting();
            await mock.insertOngoingSchedule();
        });
        it('should return non null value ongoing schedule', function (done) {
            let token = require('../utils/token').generateToken(10);
            chai.request(app)
                .get('/schedule/klien/ongoing')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.schedule.scheduleId).to.not.null;
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting();
        });
    });
    describe('when there is no ongoing schedule', function () {
        before(async function () {
            await mock.insertUserTesting();
        });
        it('should return null value ongoing schedule', function (done) {
            let token = require('../utils/token').generateToken(10);
            chai.request(app)
                .get('/schedule/klien/ongoing')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.schedule.scheduleId).to.be.null;
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting();
        });
    });
    describe('when token is not correct', function () {
        it('should return error', function (done) {
            let token = require('../utils/token').generateToken("asd");
            chai.request(app)
                .get('/schedule/klien/ongoing')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });
    });
});