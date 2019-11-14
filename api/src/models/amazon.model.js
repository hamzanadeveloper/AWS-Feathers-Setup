// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const amazon = sequelizeClient.define('amazon', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    originationNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    destinationNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    messageBody: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    inboundMessageId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  amazon.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return amazon;
};
