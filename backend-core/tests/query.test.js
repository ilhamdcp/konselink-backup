const expect = require('chai').expect;
const constant = require('../constant');
const query = require('../database/query');
const mock = require('./mock/mock');
let testingUser = mock.userTesting;

describe("query test", async function() {
    it("should create user testing", async function() {
        let isThrown = false;
        try {
            await query.insertJSONData(testingUser, constant.table.KONSELINK_USER);
        } catch (e) {
            isThrown = true;
        }
        expect(isThrown).to.be.false;
    });

    it("should get user testing", async function() {
        const user = await query.getUserByUsernameAndLoginType(testingUser.username, testingUser.login_type);
        expect(user).to.not.be.undefined;
        expect(user.username).to.be.equals(testingUser.username);
        expect(user.login_type).to.be.equals(testingUser.login_type);
    });

    it("should delete user testing", async function() {
        let isThrown = false;
        try {
            await query.deleteUserByUsernameAndLoginType(testingUser.username, testingUser.login_type);
        } catch (e) {
            isThrown = true;
        }
        expect(isThrown).to.be.false;
    });

    describe('when insertJSON data', function () {
        it('should throw error if data is not json', async function () {
            let isThrown = false;
            try {
                await query.insertJSONData("", constant.table.KLIEN_DATA);
            } catch (e) {
                isThrown = true;
            }
            expect(isThrown).to.be.true;
        });
        it('should return false if json is nested', async function () {
            let data = {
                nested: {
                    data: ""
                }
            }
            let isThrown = false;
            try {
                await query.insertJSONData(data, constant.table.KLIEN_DATA)
            } catch (e) {
                isThrown = true;
            }
            expect(isThrown).to.be.true;
        })
    })
});