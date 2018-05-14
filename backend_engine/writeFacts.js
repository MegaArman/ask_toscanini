console.time("Took");
const fs = require("fs");
const computeFacts = require("./computeFacts.js");

//invoke with "node writeFacts.js ..path to scoredir.. facts.json"
const scoreDir = process.argv[2];
const factsFile = process.argv[3];
const scoreNames = fs.readdirSync(scoreDir);
const factsDB = [];

scoreNames.forEach((scoreName) =>
{
  console.log(scoreDir + scoreName + "...");
  const musicxml = fs.readFileSync(scoreDir + scoreName);
  const scoreFacts = computeFacts(musicxml);
  scoreFacts["scoreName"] = scoreName;
  factsDB.push(scoreFacts);
});

fs.writeFileSync(factsFile, JSON.stringify(factsDB));
console.timeEnd("Took");
