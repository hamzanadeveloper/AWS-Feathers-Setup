'use strict'

const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1', accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_KEY });

module.exports = function (email, email_body) {
        const params = {
            Destination: {
              ToAddresses: [email]
            },
            Message: {
              Body: {
                Text: {
                  Charset: "UTF-8",
                  Data: email_body,
                }
              },
              Subject: {
                Charset: 'UTF-8',
                Data: 'Email | RareConnectDev'
              }
            },
            Source: 'hamza.n.arshadwork@gmail.com',
            ReplyToAddresses: [
              'hamza.n.arshadwork@gmail.com',
            ],
        };

        const sendPromise = new AWS.SES().sendEmail(params).promise();

        return sendPromise.then(
          function(data) {
            console.log(data);
          }).catch(
          function(err) {
            console.error(err, err.stack);
          });
}
