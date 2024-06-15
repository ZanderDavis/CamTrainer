module.exports = app => {
    const workouts = require("../controllers/workoutController.js");
  
    var router = require("express").Router();
  
    // Create a new workout
    router.post("/", workouts.create);
  
    // Retrieve all workout
    router.get("/", workouts.getAll);

     // updates a workout
    router.put("/:id", workouts.workoutUpdate)

    // Deletes the workout
    router.delete("/:id", workouts.deleteworkout);
  
    // Retrieve a single workout with id
    router.get("/:id", workouts.findworkout);
  
    // Update a workout with id
    router.put("/:id", workouts.update);
  
    // Delete all workout
    router.delete("/", workouts.deleteAll);

    app.use('/api/workouts', router);
  };
