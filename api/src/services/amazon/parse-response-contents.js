'use strict'

module.exports  = () => function (context) {
  console.log("Alpaca")
  console.log(context.data.Message)

  const messageData = JSON.parse(context.data.Message)
  context.data = {...messageData, ...context.data}

  return context
}
