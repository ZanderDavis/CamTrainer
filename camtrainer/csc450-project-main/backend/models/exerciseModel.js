module.exports = (sequelize, Sequelize) => {
    const exercises = sequelize.define("exercises", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      },
      isHold:{
        type: Sequelize.BOOLEAN
      },
      rules: {
        type: Sequelize.TEXT
      }
    });
  
    return exercises;
  };
