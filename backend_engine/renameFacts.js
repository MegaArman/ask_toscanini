console.time("Took");
const fs = require("fs");
const execSync = require('child_process').execSync;
//invoke with "node writeFacts.js ..path to scoredir.. facts.json"
const scoreDir = process.argv[2];
const scoreNames = fs.readdirSync(scoreDir);

scoreNames.forEach((scoreName) =>
{
  execSync("git mv " + scoreDir + scoreName + " " + scoreDir + scoreName.toLowerCase());
});

console.timeEnd("Took");
