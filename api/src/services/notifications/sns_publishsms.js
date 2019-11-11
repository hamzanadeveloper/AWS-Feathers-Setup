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

  const applicationId = your-project-id;

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

// const params = {
//   Message: message,
//   PhoneNumber: phone,
// };
//
// const publishTextPromise = new AWS.SNS().publish(params).promise();
//
// return publishTextPromise.then(
//   function(data) {
//       console.log("MessageID is " + data.MessageId);
//       console.log(data)
//   }).catch(
//   function(err) {
//       console.error(err, err.stack);
//   });
