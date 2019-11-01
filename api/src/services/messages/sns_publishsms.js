'use strict'

const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1', accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_KEY });

module.exports = function () {
    return context => {
        const params = {
            Message: context.data.body,
            PhoneNumber: context.data.phone,
        };

        const publishTextPromise = new AWS.SNS().publish(params).promise();

        return publishTextPromise.then(
            function(data) {
                console.log("MessageID is " + data.MessageId);
                console.log(data)
            }).catch(
            function(err) {
                console.error(err, err.stack);
            });
    }
}
