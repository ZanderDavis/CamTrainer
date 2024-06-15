const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to camtrainer application." });
});

//gets all models and syncs them to database
const db = require("./models");
db.sequelize.sync();

//Gets all information from routes
require("./routes/userRoutes")(app);
require("./routes/userHistoryRoutes")(app);
require("./routes/exerciseRoutes")(app);
require("./routes/workoutRoutes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});