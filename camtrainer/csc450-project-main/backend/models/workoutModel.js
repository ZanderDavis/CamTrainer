module.exports = (sequelize, Sequelize) => {
    const workouts = sequelize.define("workouts", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      },
      exerciseIds: {
        type: Sequelize.STRING,
        get() {
          return this.getDataValue('exerciseIds').split(';')
        },
        set(val) {
          this.setDataValue('exerciseIds',val.join(';'));
        },
      },
      numOfSets: {
        type: Sequelize.STRING,
        get() {
          return this.getDataValue('numOfSets').split(';')
        },
        set(val) {
          this.setDataValue('numOfSets',val.join(';'));
        },
      },
      secondsInbetweenSets: {
        type: Sequelize.INTEGER
      },
      numOfRepsOrTime: {
        type: Sequelize.STRING,
        get() {
          return this.getDataValue('numOfRepsOrTime').split(';')
        },
        set(val) {
          this.setDataValue('numOfRepsOrTime',val.join(';'));
        },
      },
  }); 
  return workouts;
  };
