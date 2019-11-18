const parseResponseContents = require('./parse-response-contents.js')
const { iff } = require("feathers-hooks-common")


module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      parseResponseContents(),
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
