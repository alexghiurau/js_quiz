/* eslint-disable linebreak-style */
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const fetch = require("node-fetch");


const app = express();

// Passport config
require('./config/passport')(passport);

// DB Configuration
const db = require('./config/keys').MongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected.'))
  .catch((err) => console.log(err));

// logging
app.use('/', (req, res, next) => {
  console.log(new Date(), req.method, req.url);
  next();
});

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Body parser
app.use(express.urlencoded({ extended: true }));

// Static middleware TO DO
app.use(express.static(`${__dirname}/assets`));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }),
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Globals
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// Declare port and start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) {
    console.log('Error starting server.', err);
  } else {
    console.log(`Server running on port ${PORT}.`);
  }
});

// For sending error codes
function error(res, err) {
  res.sendStatus(500);
  console.error(err);
}
