const fs = require("fs");
const test = require("tape").test;
const computeFacts = require("./computeFacts");

test("computeFacts", (t) =>
{
  const scoresDir = "./test_scores/";
  const scoreNames = fs.readdirSync(scoresDir);
  const actualFacts = [];

  scoreNames.forEach((scoreName) =>
  {
    const musicxml = fs.readFileSync(scoresDir + scoreName);
    actualFacts.push(computeFacts(musicxml));
  });
      
  const expectedFacts = [1,2,3];

  t.deepEqual(actualFacts, expectedFacts);
  t.end();
});
