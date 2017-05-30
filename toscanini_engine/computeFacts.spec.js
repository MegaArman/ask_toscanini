const fs = require("fs");
const test = require("tape").test;
const computeFacts = require("./computeFacts.js");

test("computeFacts", (t) =>
{
  const scoresDir = "./test_scores/";
  const scoreNames = fs.readdirSync(scoresDir);
  const actualFactsDB = [];

  scoreNames.forEach((scoreName) =>
  {
    const musicxml = fs.readFileSync(scoresDir + scoreName);
    const scoreFacts = {};
    scoreFacts[scoreName] = computeFacts(musicxml);
    actualFactsDB.push(scoreFacts);
  });
      
  const expectedFactsDB = JSON.parse(fs.readFileSync("./test_facts.json"));

  t.deepEqual(actualFactsDB, expectedFactsDB);
  t.end();
});
