module.exports = (app) => {
  const users = require("../controllers/userController.js");

  var router = require("express").Router();

  // Create a new user
  router.post("/", users.create);

  // Retrieve all users
  router.get("/:id", users.getAll);

  // updates a user
  router.put("/:id", users.Userupdate);

  // Deletes the user
  router.delete("/:email", users.deleteUser);

  // Retrieve a single user with id
  router.get("/:email/:password", users.findUser);

  // Update a user with id
  router.put("/:id", users.update);

  // Delete a user with id
  router.delete("/:id", users.delete);

  // Delete all users
  router.delete("/", users.deleteAll);

  app.use("/api/users", router);
};
