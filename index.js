const path = require("path");
const express = require("express");
const axios = require('axios');
const { url } = require("inspector");
const app = express();
// const TwitchAuth = require('./twtich/authTwitch');

// const twitchAuth = new TwitchAuth();
const Port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname)));

app.get("/", async (req, res) => {
  res.sendFile("index.html", { root: "./" });
});

app.listen(Port, () => {
  console.log("Listening on Port " + Port);
});

app.use((err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).sendFile(__dirname + "/public/400.html");
  } else {
    next();
  }
});
