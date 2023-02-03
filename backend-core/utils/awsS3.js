const AWS = require('aws-sdk');
const constant = require('../constant');

AWS.config.update({region: constant.awsS3.REGION});
let s3 = new AWS.S3({apiVersion: constant.awsS3.API_VERSION});

module.exports.getDisplayPictureUrl = function (userId, konselingRole) {
    let key = 'dp/' + konselingRole +'/' + userId + '/image.jpg';

    return s3.getSignedUrl('getObject', {
        Bucket: constant.awsS3.BUCKET_NAME,
        Key: key,
        Expires: constant.awsS3.EXPIRES
    })
};