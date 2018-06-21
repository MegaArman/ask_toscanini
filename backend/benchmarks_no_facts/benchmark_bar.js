//built from writeFacts
const fs = require("fs");

const scoreDir = process.argv[2];
const scoreNames = fs.readdirSync(scoreDir);
const factsDB = [];

const Toscanini = require("./Toscanini.js");

const discTimeArray = [];
const parseTimeArray = [];
const searchTimeArray = [];

const computeFacts = (musicxml) =>
{
  const tb = Toscanini(musicxml);
  parseTimeArray.push(tb.parseTime);

  const toscanini = tb.instance;
  const instrumentNames = toscanini.getInstrumentNames(); //[]
  const facts = {}; 
  const instrumentRanges = []; 
  
  instrumentNames.forEach((instrumentName) =>  
  {
    const range = toscanini.getPitchRange(instrumentName);
    range["instrumentName"] = instrumentName.toLowerCase();
    instrumentRanges.push(range);
  }); 

  facts["instrumentRanges"] = instrumentRanges;
  const tempos = toscanini.getTempos();
  facts["minTempo"] = Math.min(...tempos);
  facts["maxTempo"] = Math.max(...tempos);
  facts["keySignatures"] = toscanini.getKeySignatures()
    .map(ks => ks.toLowerCase());
  facts["timeSignatures"] = toscanini.getTimeSignatures();
  facts["dynamics"] = toscanini.getDynamics();
  return facts;
};


scoreNames.forEach((scoreName) =>
{
  const timePreDisc = process.hrtime();
  const musicxml = fs.readFileSync(scoreDir + scoreName);
  const discTime = process.hrtime(timePreDisc)[1];
  
  //console.log(discTime);
  discTimeArray.push(discTime);
  
  const timePreParseAndSearch = process.hrtime();
  const scoreFacts = {};
  scoreFacts[scoreName] = computeFacts(musicxml);
  factsDB.push(scoreFacts);

  const parseAndSearchTime = process.hrtime(timePreParseAndSearch)[1];
  const searchTime = parseAndSearchTime - 
    parseTimeArray[parseTimeArray.length -1];
  
  searchTimeArray.push(searchTime);
});

const sum = (arr) =>
{
  const sum = arr.reduce((accumulator, currentValue) =>
  {
    return accumulator + currentValue;
  }, 0);
  return sum;
};

console.log(sum(discTimeArray));
console.log(sum(parseTimeArray));
console.log(sum(searchTimeArray));
//console.log(JSON.stringify(results));

module.exports = factsDB;

