const constant = require('../constant');

module.exports.validateUpdateProfileParams = function (hasDisplayPicture, name, konselingRole) {
    if (typeof hasDisplayPicture !== "boolean") {
        hasDisplayPicture = undefined
    }
    if (!name || konselingRole === constant.konselingRole.PSIKOLOG) {
        name = undefined
    }
    return { hasDisplayPicture, name }
}