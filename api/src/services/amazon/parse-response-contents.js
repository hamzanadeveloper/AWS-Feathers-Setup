'use strict'

module.exports  = () => function (context) {
  console.log("Llama")
  console.log(context.data.Message)

  const new_context_data = { ...context.data.Message, ...context.data};
  console.log(new_context_data)
}
