const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session")
const connect_to_mongo = require("./db.js");

require("dotenv").config();
connect_to_mongo();
const app = express();
const port = process.env.PORT || 3000;
app.use(session({
  secret: `${process.env.SESSION_SECRET}`,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get("/", (req, res) => {
  res.send("Backend is Working");
});
app.use("/auth", require('./routes/Auth.js'))

// Start server

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
