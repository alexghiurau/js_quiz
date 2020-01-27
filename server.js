const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

const app = express();

// DB Configuration
const db = require('./config/keys').MongoURI;

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected.'))
  .catch(err => console.log(err));

// logging
app.use("/", (req, res, next) => {
  console.log(new Date(), req.method, req.url);
  next();
});

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Body parser
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// Declare port and start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, err => {
  err
    ? console.log("Error starting the server.", err)
    : console.log(`Server running on port ${PORT}.`);
});

// For sending error codes
function error(res, err) {
  res.sendStatus(500);
  console.error(err);
}
