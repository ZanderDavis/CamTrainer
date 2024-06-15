module.exports = (sequelize, Sequelize) => {
    const userHistory = sequelize.define("userHistory", {
      id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
      userId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'id'
            },
          },
      workoutId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'workouts',
              key: 'id'
            }
          },
      dateOfWorkout: {
        type: Sequelize.DATE
      },
      timeOfWorkout: {
        type: Sequelize.INTEGER
      },
    });
  
    return userHistory;
  };
