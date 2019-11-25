// Initializes the `notifications` service on path `/notifications`
const { Responses } = require('./responses.class');
const bodyParser = require("body-parser")
const createModel = require('../../models/responses.model');
const hooks = require('./responses.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  //Body of the post comes in text/plain, which we can't read as an object,
  //So we have to parse it to json.
  app.use(bodyParser.json({type: "text/plain"}))

  // Initialize our service with any options it requires
  app.use('/responses', new Responses(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('responses');

  service.hooks(hooks);
};
