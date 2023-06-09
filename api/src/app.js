const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes/index.js");
const { Diets } = require("./db");

require("./db.js");

const diets = [
  "gluten free", //está
  "dairy free", //está
  "vegetarian",
  "lacto ovo vegetarian", //está
  "vegan", //está
  "pescatarian", //está
  "paleolithic", //está
  "primal", //está
  "fodmap friendly",
  "whole 30", //está
  "ketogenic", //está
];

const server = express();

server.name = "API";

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://pi-food-main-alpha.vercel.app"); // cambiar por el enlace del deplpoy del front
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
server.use("/", async (req, res, next) => {
  const data = await Diets.findAll();
  if (data.length === 0) {
    diets.forEach((diet) => {
      Diets.create({ name: diet });
    });
  } else 
  next();
});

server.use("/", routes);

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
