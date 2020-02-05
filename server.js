const express = require("express");

const app = express();

// logging
app.use("/", (req, res, next) => {
  console.log(new Date(), req.method, req.url);
  next();
});

// static files
app.use(
  "/",
  express.static("build", {
    extensions: ["html"]
  })
);

// const PORT = process.env.PORT;
const PORT = 8080;

app.listen(PORT, err => {
  err
    ? console.log("There was an error starting the server.", err)
    : console.log(`Server running on port ${PORT}.`);
});

// for sending error codes
function error(res, err) {
  res.sendStatus(500);
  console.error(err);
}
