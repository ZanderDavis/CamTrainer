const dbConfig = require("../config/db.config.js");

//Creates database and established connection
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Creates All Models
db.users = require("./userModel.js")(sequelize, Sequelize);
db.exercises = require("./exerciseModel.js")(sequelize, Sequelize);
db.workouts = require("./workoutModel.js")(sequelize, Sequelize);
db.userHistory = require("./userHistory.js")(sequelize, Sequelize);

module.exports = db;