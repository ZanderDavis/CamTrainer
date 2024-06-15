const db = require("../models");
const exercises = db.exercises;
const Op = db.Sequelize.Op;

// Create and Save a new exercises
exports.create = (req, res) => {
        // Validate request
        if (!req.body.name || !req.body.rules) {
            res.status(400).send({
              message: "Content can not be empty!"
            });
            return;
          }
        
          // Create a user
          const exercise = {
            name: req.body.name,
            isHold: req.body.isHold, 
            rules: req.body.rules
          }; 
        
          // Save user in the database
          exercises.create(exercise)
            .then(data => {
              res.send(data);
            })
            .catch(err => {
              res.status(500).send({
                message:
                  err.message || "Some error occurred while creating the exercise."
              });
            });
};

// Updates a exercise
exports.exerciseUpdate = (req, res) => { // make a thing for a get id
 
};

// deletes the exercise
exports.deleteexercise= (req, res) =>{
  
};

// Retrieve all exercises from the exercises.
exports.getAll = async (req, res) => {
  try {
    // Use the findAll method to retrieve all records from the database
    const allExercises = await exercises.findAll();

    const exercisesArray = allExercises.map(exercise => exercise.toJSON());

    // Return the retrieved records as a response
    return res.status(200).json(exercisesArray)
  } catch (error) {
    // Handle errors if any
    console.error('Error fetching records:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Find a single exercises with an id
exports.findExerciseById = (req, res) =>{

  const exerciseId = req.params.id;

  // Find the exercise by id in the database
  exercises.findOne({ where: { id: exerciseId } }).then(exercise => {

    // Construct exerciseInfo object with necessary exercise information
    const exerciseInfo = {
      id: exercise.id,
      name: exercise.name,
      isHold: exercise.isHold,
      rules: exercise.rules,
    };


    res.status(200).send(exerciseInfo);
  }).catch(err => {
    console.log("Profile error:", err);
    return res.status(500).json({ message: 'Internal Server Error' });
  });
  
};

// Update a exercises by the id in the request
exports.update = (req, res) => {
  
};


// Delete all exercises from the database.
exports.deleteAll = (req, res) => {
  
};