const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const env = require("dotenv");
env.config();

const createfile = (jobid, language, code, is_input, inputs) => {
  console.log(jobid, language, code, is_input, inputs);
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
    });
    if (is_input) {
      fs.writeFile(`temp/${jobid}.txt`, inputs, { flag: "w" }, (err) => {
        if (err) {
          reject(err);
          return;
        }
        console.log("Both program and input files are created");
        resolve(filename);
        return;
      });
    }
    console.log("only program is created");
    resolve(filename);
  });
};

const executefile = (filename, is_input) => {
  let file = filename.split(".");
  let jobid = file[0];
  let language = file[1];
  let command;
  switch (language) {
    case "cpp":
      if (is_input) {
        command = `cd ${process.env.TEMP_PATH} && g++ ${filename} -o ${jobid} && ${jobid}.exe < ${jobid}.txt`;
        break;
      }
      command = `cd ${process.env.TEMP_PATH} && g++ ${filename} -o ${jobid} && ${jobid}.exe`;
      break;
    case "c":
      if (is_input) {
        command = `cd ${process.env.TEMP_PATH} && g++ ${filename} -o ${jobid} && ${jobid}.exe < ${jobid}.txt`;
        break;
      }
      command = `cd ${process.env.TEMP_PATH} && g++ ${filename} -o ${jobid} && ${jobid}.exe`;
      break;
    case "py":
      temp = path.join(process.env.TEMP_PATH, filename);
      if (is_input) {
        command = `cd ${process.env.TEMP_PATH} && python ${filename} < ${jobid}.txt`;
        break;
      }
      command = `python -u ${temp}`;
      break;
    case "php":
      temp = path.join(process.env.TEMP_PATH, filename);
      if (is_input) {
        command = `cd ${process.env.TEMP_PATH} && php ${filename} < ${jobid}.txt`;
        break;
      }
      command = `php ${temp}`;
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
      console.log(stdout, stderr);
      resolve(data);
    });
  });
};

module.exports = { executefile, createfile };
