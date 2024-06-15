const db = require("../models");
const users = db.users;
const Op = db.Sequelize.Op;

// Create and Save a new users
exports.create = (req, res) => {
  // Validate request
  if (!req.body.username) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a user
  const user = {
    weight: req.body.weight,
    feet: req.body.feet,
    inches: req.body.inches,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    rating: req.body.rating,
  };

  // Save user in the database
  users
    .create(user)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

// Updates a user
exports.Userupdate = (req, res) => {
  // make a thing for a get id
  const userID = req.params.id;
  console.log("id is ", userID);
  if (!req.body.username) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  users
    .findOne({ where: { id: userID } })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User not found with id " + req.params.userId,
        });
      }

      // Update user information with data from req.body
      user.email = req.body.email;
      user.username = req.body.username;
      user.password = req.body.password;
      user.feet = req.body.feet;
      user.inches = req.body.inches;
      user.weight = req.body.weight;
      user.rating = req.body.rating;

      console.log("username is ", user.username);

      // Save the updated user in the database
      user
        .save()
        .then(() => {
          res.send({ message: "User updated successfully" });
        })
        .catch((err) => {
          return res.status(500).send({
            message: "Error updating user with id " + req.params.userId,
          });
        });
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error retrieving user with id " + req.params.userId,
      });
    });
};

// deletes the user
exports.deleteUser = (req, res) => {
  console.log("in delete");
  const userEmail = req.params.email;

  users
    .findOne({ where: { email: userEmail } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user
        .destroy()
        .then(() => {
          return res.status(200).json({ message: "User deleted successfully" });
        })
        .catch((err) => {
          return res.status(500).json({ message: "Internal server error" });
        });
    })
    .catch((err) => {
      return res.status(500).json({ message: "Internal server error" });
    });
};

// Retrieve all users from the users.
exports.getAll = (req, res) => {
  const userId = req.params.id;

  // Find the user by id in the database
  users
    .findOne({ where: { id: userId } })
    .then((user) => {
      if (!user) {
        console.log("Profile no user");
        return res.status(404).json({ message: "User not found" });
      }

      // Construct userInfo object with necessary user information
      const userInfo = {
        id: user.id,
        email: user.email,
        username: user.username,
        password: user.password,
        feet: user.feet,
        inches: user.inches,
        weight: user.weight,
        rating: user.rating,
      };

      res.status(200).send(userInfo);
    })
    .catch((err) => {
      console.log("Profile error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    });
};

// Find a single users with an id
exports.findUser = (req, res) => {
  const userEmail = req.params.email; // takes password form parameter
  const userpassword = req.params.password;
  const user = {
    email: userEmail,
    password: userpassword,
  };
  console.log(user);
  users
    .findOne({ where: { email: user.email, password: user.password } })
    .then((foundUser) => {
      if (!foundUser) {
        // triggers when there is no password matching
        console.log("Iwhy");
        return res
          .status(404)
          .send({ success: false, message: "Incorrect email or password" });
      }
      console.log("yippie");
      return res.send({ success: true, user: foundUser });
    })
    .catch((err) => {
      console.log("god");
      res.status(500).send({
        message: err.message || "Some error occurred while logging in",
      });
      return false;
    });
};

exports.findByEmail = (req, res) => {
  const userEmail = req.params.email;
  const user = {
    email: userEmail,
  };
};

// Update a users by the id in the request
exports.update = (req, res) => {};

// Delete a users with the specified id in the request
exports.delete = (req, res) => {};

// Delete all users from the database.
exports.deleteAll = (req, res) => {};
