'use strict'

module.exports  = () => function (context) {
  console.log("Alpaca")
  console.log(context.data.Message)

  const result = Object.assign({}, context, ...context.data.Message);
  console.log(result)
}
