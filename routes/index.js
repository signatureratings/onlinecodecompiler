const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).sendFile("index.html");
});

router.post("/", (req, res) => {
  res.status(200).send("hello world");
});

module.exports = router;
