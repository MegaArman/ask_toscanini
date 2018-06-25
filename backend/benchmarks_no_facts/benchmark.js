//built from writeFacts
const fs = require("fs");
const scoreDir = process.argv[2];
const scoreNames = fs.readdirSync(scoreDir);
const Toscanini = require("./Toscanini.js");

const numRuns = 10;
console.log(`will analyze ${scoreDir} ${numRuns} times`); 

const finalResult = 
{
 discTimeRuns: [],
 parseTimeRuns: [],
 searchTimeRuns: []
};

const NS_PER_SEC = 1e9;

for (let i = 0; i < numRuns; i++)
{
  let totalDiscTime = 0;
  let totalParseTime = 0;
  let totalSearchTime = 0;

  scoreNames.forEach((scoreName) =>
  {
    const timePreDisc = process.hrtime();
    const musicxml = fs.readFileSync(scoreDir + scoreName);
    const diffDiscTime = process.hrtime(timePreDisc);
    const discTime = diffDiscTime[0] * NS_PER_SEC + diffDiscTime[1];
    totalDiscTime += discTime;
    //-------------------------------- 
    const tb = Toscanini(musicxml);
    totalParseTime += tb.parseTime;
    //---------------------------------
    const timePreSearch = process.hrtime();
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
    facts["keySignatures"] = toscanini.getKeySignatures();
    facts["timeSignatures"] = toscanini.getTimeSignatures();
    facts["dynamics"] = toscanini.getDynamics();

    const diffSearchTime = process.hrtime(timePreSearch);
    const searchTime = diffSearchTime[0] * NS_PER_SEC + diffSearchTime[1];
    totalSearchTime += searchTime;
  });

  finalResult.discTimeRuns.push(totalDiscTime);
  finalResult.parseTimeRuns.push(totalParseTime);
  finalResult.searchTimeRuns.push(totalSearchTime);
}

console.log(JSON.stringify(finalResult));
