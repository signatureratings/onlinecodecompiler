const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const FileSchema = require("../models/file");
const { createfile, executefile } = require("../functions/executefile");

router.get("/", (req, res) => {
  res.status(400).send("We do not accept Get request");
});

router.post("/", async (req, res) => {
  let { language, code, jobid } = req.body;
  console.log("i got request", req);
  try {
    let job_id = jobid ? jobid : uuidv4();
    let filename = await createfile(job_id, language, code);
    let result = await executefile(filename);
    if (result.stdout) {
      console.log(result.stdout);
      let data = {
        jobid: job_id,
        language: language,
        filecontent: code,
        executed: 1,
        last_modified: new Date(),
      };
      if (!jobid) {
        let FileData = new FileSchema(data);
        let temp = await FileData.save();
      } else {
        FileSchema.updateOne(
          { jobid: job_id },
          { $set: { filecontent: code, last_modified: new Date() } },
          { upsert: true }
        );
      }
      res.cookie("last_access", new Date());
      res.status(200).json({
        status: true,
        result: result.stdout,
        info: "File executed succesfully",
        jobid: result.jobid,
        language: language,
      });
    } else {
      console.log(result.stderr);
      res.status(200).json({
        status: false,
        result: result.stderr,
        info: "Error occured while executing the program check the syntax",
        jobid: result.jobid,
        language: language,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      result: err.message,
      info: "Server side error",
    });
  }
});

module.exports = router;
