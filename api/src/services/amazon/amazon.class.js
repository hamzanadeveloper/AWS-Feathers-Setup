const { Service } = require('feathers-sequelize');

exports.Amazon = class Amazon extends Service {
  create(data, params){
    console.log(data)
    console.log(params)
  }
};
