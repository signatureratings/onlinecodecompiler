const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  jobid: { type: "string", required: true, unique: true },
  language: { type: "string", required: true },
  filecontent: { type: "string", required: true },
  executed: { type: "Number", default: 1 },
  last_modified: { type: "Date", default: Date.now() },
});

module.exports = mongoose.model("FileSchema", FileSchema);
