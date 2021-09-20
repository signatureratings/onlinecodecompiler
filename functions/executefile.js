const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const env = require("dotenv");
env.config();

const createfile = (jobid, language, code) => {
  let filename = `${jobid}.${language}`;
  let create = false;
  switch (language) {
    case "cpp":
      create = true;
      break;
    case "py":
      create = true;
      break;
    case "c":
      create = true;
      break;
    case "php":
      create = "true";
      break;
    default:
      command = false;
  }

  return new Promise((resolve, reject) => {
    if (!create) {
      reject(new Error("file type is not supported for coding"));
      return;
    }
    fs.writeFile(`temp/${filename}`, code, { flag: "w" }, (err) => {
      if (err) {
        reject(err);
        return;
      }
      console.log("File created");
      resolve(filename);
    });
  });
};

const executefile = (filename) => {
  let file = filename.split(".");
  let jobid = file[0];
  let language = file[1];
  let command;
  switch (language) {
    case "cpp":
      command = `cd ${process.env.TEMP_PATH} && g++ ${filename} -o ${jobid} && ${jobid}.exe`;
      break;
    case "c":
      command = `cd ${process.env.TEMP_PATH} && g++ ${filename} -o ${jobid} && ${jobid}.exe`;
      break;
    case "py":
      let temp = path.join(process.env.TEMP_PATH, filename);
      command = `python -u ${temp}`;
      break;
    case "php":
      let t = path.join(process.env.TEMP_PATH, filename);
      command = `php ${t}`;
      break;
    default:
      command = false;
  }

  return new Promise((resolve, reject) => {
    if (!command) {
      reject(new Error("File type is not supported for coding"));
      return;
    }
    exec(command, (err, stdout, stderr) => {
      if (err) {
        err.jobid = jobid;
        reject(err);
        return;
      }
      console.log("got output");
      let data = { stdout, stderr, jobid };
      resolve(data);
    });
  });
};

module.exports = { executefile, createfile };
