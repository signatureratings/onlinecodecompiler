const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const path = require("path");
const indexRouter = require("./routes/index");
const codeRouter = require("./routes/code");
const databaseConnection = require("./database");

//database connection
databaseConnection();

//middleware ware
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/", indexRouter);
app.use("/code", codeRouter);

//listening to the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server started running");
});
