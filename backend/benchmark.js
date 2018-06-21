//built from writeFacts
const fs = require("fs");

const scoreDir = process.argv[2];
const scoreNames = fs.readdirSync(scoreDir);
const factsDB = [];

const Toscanini = require("./Toscanini.js");

const results = 
{
  discTimeArray : [], 
  parseTimeArray: [],
  searchTimeArray: []
};

const computeFacts = (musicxml) =>
{
  const tb = Toscanini(musicxml);
  const toscanini = tb.instance;
  //console.log("parseTime", tb.parseTime);
  results.parseTimeArray.push(tb.parseTime);

  const instrumentNames = toscanini.getInstrumentNames(); //[]
  const facts = {}; 
  const instrumentRanges = {}; 
  
  instrumentNames.forEach((instrumentName) =>  
  {
    let range = toscanini.getPitchRange(instrumentName);
    instrumentRanges[instrumentName.toLowerCase()] = range;
  }); 

  facts["instrumentRanges"] = instrumentRanges;
  facts["tempos"] = toscanini.getTempos();
  facts["keySignatures"] = toscanini.getKeySignatures();
  facts["timeSignatures"] = toscanini.getTimeSignatures();

  return facts;
};

let i = 0;

scoreNames.forEach((scoreName) =>
{
  if (i < 3)
  {
    i++;
  }
  else
  {
    return;
  }
  //console.log(scoreDir + scoreName + "...");

  const timePreDisc = process.hrtime();
  const musicxml = fs.readFileSync(scoreDir + scoreName);
  const discTime = process.hrtime(timePreDisc)[1];
  
  //console.log(discTime);
  results.discTimeArray.push(discTime);
  
  const timePreParseAndSearch = process.hrtime();
  const scoreFacts = {};
  scoreFacts[scoreName] = computeFacts(musicxml);
  factsDB.push(scoreFacts);

  const parseAndSearchTime = process.hrtime(timePreParseAndSearch)[1];
  const searchTime = parseAndSearchTime - results.parseAndSearchTime;
  
  results.searchTimeArray.push(searchTime);
});

const avg = (arr) =>
{
  const sum = arr.reduce((accumulator, currentValue) =>
  {
    return accumulator + currentValue;
  }, 0);
  return sum / arr.length;
};

console.log("avgDiscTime", avg(results.discTimeArray));
//console.log(JSON.stringify(results));


module.exports = factsDB;

