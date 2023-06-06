const express = require("express");
const morgan = require("morgan");
const router = require("../config/routes");
const cookieParser = require("cookie-parser")

const app = express();


app.use(cookieParser('secret'));

/** Install request logger */
app.use(morgan("dev"));

/** Install JSON request parser */
app.use(express.json());

/** Install Router */
app.use(router);

module.exports = app;
