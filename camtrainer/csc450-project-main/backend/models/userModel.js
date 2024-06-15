module.exports = (sequelize, Sequelize) => {
    const users = sequelize.define("users", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      weight: {
        type: Sequelize.INTEGER
      },
      feet: {
        type: Sequelize.INTEGER
      },
      inches: {
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      rating: {
        type: Sequelize.STRING
      },
      isAdmin: {
        type: Sequelize.BOOLEAN
      }
    });
  
    return users;
  };
