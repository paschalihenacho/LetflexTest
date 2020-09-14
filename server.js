const express = require("express");
const session = require("express-session");

const mongoose = require("mongoose");
const routes = require("./routes");
const passport = require("./passportAuth/passport");
//const dbConnection = require("./db"); // loads our connection to the mongo database
const app = express();
const PORT = process.env.PORT || 5000;

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  // index.html for all page routes    html or routing and naviagtion
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}
// Add routes, both API and view
app.use(routes);

// ===== Passport ====
app.use(passport.initialize());
app.use(passport.session()); // will call the deserializeUser

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI) ||
  "mongodb://localhost/reactreadinglist";

// Start the API server
app.listen(PORT, function () {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
