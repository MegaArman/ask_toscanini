//built from writeFacts
const fs = require("fs");
const scoreDir = process.argv[2];
const scoreNames = fs.readdirSync(scoreDir);
const Toscanini = require("./Toscanini.js");

const finalResult = 
{
 discTimeRuns: [],
 parseTimeRuns: [],
 searchTimeRuns: []
};

for (let i = 0; i < 2; i++)
{
  let totalDiscTime = 0;
  let totalParseTime = 0;
  let totalSearchTime = 0;

  scoreNames.forEach((scoreName) =>
  {
    const timePreDisc = process.hrtime();
    const musicxml = fs.readFileSync(scoreDir + scoreName);
    const discTime = process.hrtime(timePreDisc)[1];
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

    const searchTime = process.hrtime(timePreSearch)[1];
    totalSearchTime += searchTime;
  });

  finalResult.discTimeRuns.push(totalDiscTime);
  finalResult.parseTimeRuns.push(totalParseTime);
  finalResult.searchTimeRuns.push(totalSearchTime);
}

fs.writeFileSync("benchmark_pi.json", JSON.stringify(finalResult));
