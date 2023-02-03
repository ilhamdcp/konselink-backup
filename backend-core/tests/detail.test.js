const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const mock = require('./mock/mock')
const userTesting = mock.userTesting;
const expect = chai.expect;

chai.use(chaiHttp);
chai.should();

describe('psikolog detail test', function () {
    describe('when user is exists', function () {
        before(async function () {
            await mock.insertUserTesting();
            await mock.insertPsikologData();
            await mock.insertPsikologSchedule();
        });
        it ('should return detail of psikolog',  function (done) {
            let token = require('../utils/token').generateToken(userTesting.id);
            chai.request(app)
                .get('/detail/psikolog/10/')
                .set('Authorization', token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.not.be.undefined;
                    expect(res.body.data.fullName).to.not.be.undefined;
                    expect(res.body.data.counselorId).to.not.be.undefined;
                    expect(res.body.data.specialization).to.not.be.undefined;
                    expect(res.body.data.sipNumber).to.not.be.undefined;
                    expect(res.body.data.sspNumber).to.not.be.undefined;
                    expect(res.body.data.strNumber).to.not.be.undefined;
                    expect(res.body.data.displayPictureUrl).to.not.be.undefined;
                    done();
                });
        });
        after(async function () {
            await mock.deleteUserTesting()
        });
    });

    describe('when user doesnt exists', function () {
        it('should return 404', function (done) {
            let token = require('../utils/token').generateToken(userTesting.id);
            chai.request(app)
                .get('/detail/psikolog/0/')
                .set('Authorization', token)
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    done();
                });
        })
    })
})