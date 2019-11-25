const { authenticate } = require('@feathersjs/authentication').hooks;
const sendSMSMessage = require('./sns_publishsms.js')
const sendSESEmail = require('./ses_sendemail.js')

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [
      hook => {
        if(hook.data.type === "sms"){
          sendSMSMessage(hook.data.address, hook.data.body)
        } else if(hook.data.type === "email"){
          sendSESEmail(hook.data.address, hook.data.body)
        }
        return hook
      },
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
