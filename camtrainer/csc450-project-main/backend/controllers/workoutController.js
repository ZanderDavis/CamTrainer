const db = require("../models");
const workouts = db.workouts;
const Op = db.Sequelize.Op;

// Create and Save a new workouts
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name || !req.body.exerciseIds) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a user
  const workout = {
    name: req.body.name,
    exerciseIds: req.body.exerciseIds,
    numOfSets: req.body.numOfSets,
    secondsInbetweenSets: req.body.secondsInbetweenSets,
    numOfRepsOrTime: req.body.numOfRepsOrTime,
  };

  // Save user in the database
  workouts
    .create(workout)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the exercise.",
      });
    });
};

// Updates a workout
exports.workoutUpdate = (req, res) => {
  // make a thing for a get id
};

// deletes the workout
exports.deleteworkout = (req, res) => {};

// Retrieve all workouts from the workouts.
exports.getAll = (req, res) => {
  workouts
    .findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving workouts.",
      });
    });
};

// Find a single workouts with an id
exports.findworkout = (req, res) => {};

// Update a workouts by the id in the request
exports.update = (req, res) => {};

// Delete all workouts from the database.
exports.deleteAll = (req, res) => {};
