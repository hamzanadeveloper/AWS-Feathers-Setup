
const { iff } = require("feathers-hooks-common")

const isSubscriptionConfirmationRequest = (context) => {
  return context.params.headers["x-amz-sns-message-type"] === "SubscriptionConfirmation"
}

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      iff(isSubscriptionConfirmationRequest, console.log("Whats up") )
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
