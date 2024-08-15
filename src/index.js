const bodyParser = require("body-parser");
const express = require("express");
const dbConnect = require("./configs/databaseConnect");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT;
const {
  authRoutes,
  userRoutes, 
  productRoutes,
} = require("./routes/index");
const indexRouter = require('./routes/index');
const whitelist = ['*'];

dbConnect();
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const api_Uri = "/api/v1/";

app.use(`${api_Uri}`, authRoutes);
app.use(`${api_Uri}`, userRoutes);
app.use(`${api_Uri}`, productRoutes);

app.use((req, res, next) => {
  const origin = req.get('referer');
  const isWhitelisted = whitelist.find((w) => origin && origin.includes(w));
  if (isWhitelisted) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
  }
  // Pass to next layer of middleware
  if (req.method === 'OPTIONS') res.sendStatus(200);
  else next();
});

const setContext = (req, res, next) => {
  if (!req.context) req.context = {};
  next();
};
app.use('/', indexRouter);

// This should be the last route else any after it won't work
app.use("*", (req, res) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running  at PORT ${PORT}`);
});