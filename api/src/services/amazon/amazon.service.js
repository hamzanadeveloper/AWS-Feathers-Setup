// Initializes the `notifications` service on path `/notifications`
const { Amazon } = require('./amazon.class');
const bodyParser = require("body-parser")
const createModel = require('../../models/amazon.model');
const hooks = require('./amazon.hooks');

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
  app.use('/amazon', new Amazon(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('amazon');

  service.hooks(hooks);
};
