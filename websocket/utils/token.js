const jwt = require('jsonwebtoken');

module.exports.verifyAndGetValueFromToken = function (query) {
    if (query && query.token) {
        return jwt.verify(query.token, process.env.SECRET, function (err, decoded) {
            if (err) {
                return false;
            } else {
                return decoded;
            }
        });
    }
    return false;
}

