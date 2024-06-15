const db = require("../models");
const userHistory = db.userHistory;
const Op = db.Sequelize.Op;

// Create and Save a new record
exports.create = (req, res) => {
  // Validate request
  if (
    !req.body.userId ||
    !req.body.workoutId ||
    !req.body.dateOfWorkout ||
    !req.body.timeOfWorkout
  ) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a userHistory
  const thisUserHistory = {
    userId: req.body.userId,
    workoutId: req.body.workoutId,
    dateOfWorkout: req.body.dateOfWorkout,
    timeOfWorkout: req.body.timeOfWorkout,
  };

  // Save userHistory in the database
  userHistory
    .create(thisUserHistory)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the userHistory.",
      });
    });
};

// Updates a record
exports.userHistoryUpdate = (req, res) => {
  // make a thing for a get id
};

// deletes the record
exports.deleteUserHistory = (req, res) => {};

// Find a single records with an id
exports.Past = (req, res) => {
  console.log("In controller");
  const iduser = req.params.userId; // takes password form parameter
  console.log(iduser);
  userHistory
    .findAll({ where: { userId: iduser } })
    .then((foundData) => {
      if (!foundData) {
        // triggers when there is no password matching
        console.log("no workout");
        return res
          .status(404)
          .send({ success: false, message: "Incorrect email or password" });
      }
      console.log(foundData.timeOfWorkout);
      res.send(foundData);
    })
    .catch((err) => {
      console.log("god");
      res.status(500).send({
        message: err.message || "Some error occurred while logging in",
      });
      return false;
    });
};

// Find a single records with an id
exports.findUserHistory = (req, res) => {};

// Delete a records with the specified id in the request
exports.delete = (req, res) => {};

// Delete all records from the database.
exports.deleteAll = (req, res) => {};
