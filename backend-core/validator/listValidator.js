const constant = require('../constant');

module.exports.validateListParams = function (entrySize, pageNo, keyword) {
    if (entrySize === undefined || isNaN(entrySize) || parseInt(entrySize) <= 0) {
        entrySize = constant.DEFAULT_ENTRY_SIZE;
    }
    if (pageNo === undefined || isNaN(pageNo) || parseInt(pageNo) <= 0) {
        pageNo = constant.DEFAULT_PAGE_NO;
    }
    if (!keyword) {
        keyword = "";
    }
    return { entrySize, pageNo, keyword };
};