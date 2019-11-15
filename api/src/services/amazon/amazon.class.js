const { Service } = require('feathers-sequelize');
const request = require("request")
const errors = require("feathers-errors")


const isSubscriptionConfirmationRequest = (params) => {
  return params.headers["x-amz-sns-message-type"] === "SubscriptionConfirmation"
}

exports.Amazon = class Amazon extends Service {
  create(params){
    console.log(params)

    // if(isSubscriptionConfirmationRequest(params)){
    //   console.log("This is a subscription confirmation request.")
    //
    //   request.get(data.SubscribeURL, (err, res, body) => {
    //     console.log("[INFO] GET on SNS subscription URL: " + data.SubscribeURL)
    //
    //     if(err){
    //       reject(new errors.BadRequest("GET on subscription URL failed"))
    //     } else {
    //         console.log("[INFO] SNS subscription confirmed")
    //     }
    //   })
    //
    // }
  }
};
