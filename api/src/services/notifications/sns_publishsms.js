'use strict'

const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1', accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_KEY });

module.exports = function (phone, use_message) {
  const originationNumber = "+15878096460";
  const destinationNumber = phone;
  const languageCode = "en-US";

  const message = "This message was sent from Feathers-React-Starter "
    + "using the AWS SDK for JavaScript in Node.js. Reply STOP to "
    + "opt out.";

  const applicationId = "bf53f587623149b5b39d295f1d60d68e";

  const messageType = "TRANSACTIONAL";

  AWS.config.update({region:'us-east-1'});

  let pinpoint = new AWS.Pinpoint();

  const params = {
    ApplicationId: applicationId,
    MessageRequest: {
      Addresses: {
        [destinationNumber]: {
          ChannelType: 'SMS'
        }
      },
      MessageConfiguration: {
        SMSMessage: {
          Body: message,
          MessageType: messageType,
          OriginationNumber: originationNumber,
        }
      }
    }
  };

  pinpoint.sendMessages(params, function(err, data) {
    if(err) {
      console.log(err.message);
    } else {
      console.log("Message sent! "
        + data['MessageResponse']['Result'][destinationNumber]['StatusMessage']);
    }
  });
}
