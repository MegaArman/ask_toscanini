//writeFacts will extract and write facts of a score to a file
console.time("Took");
const fs = require("fs");
const Toscanini = require("./Toscanini.js");

const factsDB = new Map();
const fileNames = fs.readdirSync("./scores");
fileNames.forEach((fileName) =>
{
  console.log("./scores/" + fileName);
  const musicXML = fs.readFileSync("./scores/" + fileName);
  const toscanini = Toscanini(musicXML);
  const instrumentNames = toscanini.getInstrumentNames(); //[]
  const fact = {};
  const instrumentRanges = {};
  
  instrumentNames.forEach((instrumentName) => 
  {
    let range = toscanini.getPitchRange(instrumentName);
    instrumentRanges[instrumentName.toLowerCase()] = range;
  });

  fact["instrumentRanges"] = instrumentRanges;
  fact["tempos"] = toscanini.getTempos();
  fact["keySignatures"] = toscanini.getKeySignatures(); 
  factsDB.set(fileName, fact);
});

fs.writeFile("facts.json", JSON.stringify([...factsDB]), (err) =>
{
  if (err)
  {
    console.log("err");
  }
  else
  {
    console.log("saved!");
  }
});
console.timeEnd("Took");
