const express = require("express");
const expressLayouts = require('express-ejs-layouts');

const app = express();


// logging
app.use("/", (req, res, next) => {
  console.log(new Date(), req.method, req.url);
  next();
});

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// Static files
// app.use(
//   "/",
//   express.static("build", {
//     extensions: ["html"]
//   })
// );


// Declare port and start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, err => {
  err
    ? console.log("There was an error starting the server.", err)
    : console.log(`Server running on port ${PORT}.`);
});


// For sending error codes
function error(res, err) {
  res.sendStatus(500);
  console.error(err);
}
