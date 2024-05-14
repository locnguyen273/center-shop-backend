const bodyParser = require("body-parser");
const express = require("express");
const dbConnect = require("./configs/databaseConnect");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT;
const authRoutes = require("./routes/auth.route");

dbConnect();
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const api_Uri = "/api/v1/";

app.use(`${api_Uri}`, authRoutes);


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