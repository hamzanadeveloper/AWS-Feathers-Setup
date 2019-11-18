'use strict'

module.exports  = () => function (context) {
  console.log("Alpaca")
  console.log(context.data.Message)

  const messageData = JSON.parse(context.data.Message)
  const new_context_data = { ...messageData, ...context.data};
  console.log(new_context_data)
}
