const express = require("express");

const fetch = require("node-fetch");
require("dotenv").config();

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

//   SERVER API
//
//   GET  /api/X            - gets something

// app.get("/api/X", someFunction);

// const PORT = process.env.PORT;
const PORT = 8080;

app.listen(PORT, err => {
  err
    ? console.log("There was an error starting the server.", err)
    : console.log(`Server running on port ${PORT}.`);
});

// SERVER FUNCTIONS

// async function getSeniorulData(req, res) {
//   const api_key = process.env.API_KEY;
//   const regions = ["euw1", "eun1"];
//   try {
//     await fetch(
//       `https://${
//         regions[1]
//       }.api.riotgames.com/lol/league/v4/entries/by-summoner/gOIXNpZ7P_NOl2BR5iqvD9zMFm0ZMI0xO3D0Ht14g8x2E8I?api_key=${api_key}`
//     )
//       .then(res => res.json())
//       .then(data =>
//         res.send(data.sort((a, b) => a.queueType.localeCompare(b.queueType)))
//       );
//   } catch (e) {
//     error(res, e);
//   }
// }

// for sending error codes
function error(res, err) {
  res.sendStatus(500);
  console.error(err);
}
