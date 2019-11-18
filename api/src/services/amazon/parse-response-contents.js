'use strict'

module.exports  = () => function (context) {
  // The message object was stringified, so we need parse it and spread it into the data object.
  const messageData = JSON.parse(context.data.Message)
  context.data = {...messageData, ...context.data}

  return context
}
