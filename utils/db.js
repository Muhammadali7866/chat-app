const Sequelize = require("sequelize");
const configData = require("../config/config.json")["development"];

// create new instance
const sequelize = new Sequelize(configData);

// test the database
sequelize
  .authenticate()
  .then(() => {
    console.log("Database is connected succesfully");
  })
  .catch((error) => {
    console.log(error.message);
  });

// exports
module.exports = sequelize;
