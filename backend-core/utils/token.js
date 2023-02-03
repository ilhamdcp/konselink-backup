const jwt = require('jsonwebtoken');
const constant = require('../constant');

module.exports.generateToken = function (userId) {
    return jwt.sign({
        userId: userId
    }, process.env.SECRET);
};

const verifyAndGetValueFromToken = function (token) {
    return jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (!err) {
            if (decoded.userId !== undefined) {
                return decoded;
            }
        }
        return false;
    });
};

module.exports.verifyToken = function(req, res, next) {
    try{
        let token = req.headers['authorization'];
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        let decodedToken = verifyAndGetValueFromToken(token);

        if (decodedToken) {
            req.decodedToken = decodedToken;
            next();
        } else {
            res.status(constant.UNAUTHORIZED.code).send(constant.UNAUTHORIZED)
        }
    } catch (err) {
        res.status(constant.UNAUTHORIZED.code).send(constant.UNAUTHORIZED)
    }
};