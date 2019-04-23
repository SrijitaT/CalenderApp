const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();
const users = require("./routes/api/users");
const events = require("./routes/api/events");
const dbConn = require("./dbConnection");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//passport middleware
app.use(passport.initialize());
//Passport Config
require("./config/passport")(passport);

app.use("/api/users", users);
app.use("/api/events", events);
app.listen(3000, () => console.log("Server started!"));
