const users = require('./users/users.service.js');
const notifications = require('./notifications/notifications.service.js');
const responses = require('./responses/responses.service.js');
const recipients = require('./recipients/recipients.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(notifications);
  app.configure(responses);
  app.configure(recipients);
};
