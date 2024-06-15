module.exports = app => {
    const exercises = require("../controllers/exerciseController.js");
  
    var router = require("express").Router();
  
    // Create a new exercise
    router.post("/", exercises.create);
  
    // Retrieve all exercise
    router.get("/", exercises.getAll);

     // updates a exercise
    router.put("/:id", exercises.exerciseUpdate)
  
    // Retrieve a single exercise with id
    router.get("/:id", exercises.findExerciseById);
  
    // Update a exercise with id
    router.put("/:id", exercises.update);


    app.use('/api/exercises', router);
  };
