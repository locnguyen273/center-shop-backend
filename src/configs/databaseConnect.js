const { default: mongoose } = require("mongoose");
mongoose.set("strictQuery", false);

const databaseConnect = async () => {
  await mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};

module.exports = databaseConnect;
