'use strict'

module.exports  = () => function (context) {
  console.log("Llama")
  console.log(context.data.Message)

  return Object.assign({}, context, ...context.data.Message)
}
