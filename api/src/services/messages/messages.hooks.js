const { authenticate } = require('@feathersjs/authentication').hooks;
const sendSMSMessage = require('./sns_publishsms.js')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      sendSMSMessage(),
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
