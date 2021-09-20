const mongoose = require("mongoose");

function databaseConnection() {
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on("error", (error) => console.error(error));
  db.once("open", () => console.log("Connected to Mongoose"));
}

module.exports = databaseConnection;
