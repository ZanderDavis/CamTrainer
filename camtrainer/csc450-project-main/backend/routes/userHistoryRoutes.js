module.exports = app => {
    const userHistory = require("../controllers/userHistoryController.js");
  
    var router = require("express").Router();
  
    // Create a new record
    router.post("/", userHistory.create);
  
    //gets all records
    router.get("/:userId", userHistory.Past);

    // Retrieve a single record with id
    router.get("/:userId", userHistory.findUserHistory);


    app.use('/api/userHistory', router);
  };

  
