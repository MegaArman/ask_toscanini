//writeFacts will extract and write facts of a score to a file
//takes a directory to read from and filename to write to
const Toscanini = require("./Toscanini.js");

module.exports = (musicxml) =>
{
  const toscanini = Toscanini(musicxml);
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
