'use strict'

module.exports  = () => function (context) {
  console.log("Llama")
  console.log(context.data.Message)

  const new_context_data = Object.assign({}, context.data, ...context.data.Message);
  console.log(new_context_data)
}
