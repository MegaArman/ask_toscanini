//writeFacts will extract and write facts of a score to a file
//takes a directory to read from and filename to write to
const Toscanini = require("toscanini");

module.exports = (musicxml) =>
{
  const toscanini = Toscanini(musicxml);
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
  facts["tempos"] = toscanini.getTempos();
  facts["keySignatures"] = toscanini.getKeySignatures();
  facts["timeSignatures"] = toscanini.getTimeSignatures();

  return facts;
};
