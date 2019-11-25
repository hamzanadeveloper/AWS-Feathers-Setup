'use strict'

module.exports  = () => function (context) {
  if(context.params.headers["x-amz-sns-message-type"] === "SubscriptionConfirmation"){
    console.log(context.data)
  }
  // The message object was stringified, so we need parse it and spread it into the data object.
  const messageData = JSON.parse(context.data.Message)
  context.data = {...messageData, ...context.data}

  return context
}
