

//TODO check query length to begin with!
//^should this only be done serverside?
{
  const queryObj =	{
  						$and:[]
                    };
  const cm = require("concertmaster");
}

start
	= _(clause)(_"and"_ clause)*_

clause = (musicTerm / instrumentRange / composerInstrument)
{
	return queryObj;
}

instrumentRange = instrument:([a-zA-Z0-9])+ _ min:([a-gA-G][b|#]?[0-9]) _ max:([a-gA-G][b|#]?[0-9])
{
    const path = "instrumentRanges.";
    const rangeQuery = {};
    const minPitch = cm.noteStringToMidiNum(min.join("", 10));
    const maxPitch = cm.noteStringToMidiNum(max.join("", 10));
    rangeQuery[path + "instrumentName"] = {$regex: instrument.join("")};
    rangeQuery[path + "minPitch"] = {$gte: minPitch};  
    rangeQuery[path + "maxPitch"] = {$lte: maxPitch};
    queryObj.$and.push(rangeQuery);    
}

composerInstrument = ci:([a-zA-Z0-9]+)
{
	queryObj.$and.push({"_id": {$regex:ci.join("").toLowerCase()}});
}

musicTerm = "ts"_ beats:([1-9][0-9]?) _ beatType:([1-9][0-9]?)
{
	queryObj.$and.push(
    	{"timeSignatures": 
    		{"beats": parseInt(beats.join("", 10)), "beatType": parseInt(beatType.join("", 10))}
        });
}
/ "tempo" _ min:([0-9][0-9]?[0-9]?) _ max:([1-9][0-9]?[0-9]?)
{
	const minTempo = parseInt(min.join("", 10));
        const maxTempo = parseInt(max.join("", 10));
    
	if (minTempo < maxTempo)
    {
    	queryObj.$and.push({"minTempo": {$gte: minTempo}}, {"maxTempo": {$lte: maxTempo}});
    }
}
/ "key" _ key:([a-gA-G][b|#]?)
{
	queryObj.$and.push({"keySignatures": key.join("")});
}

_ "whitespace"
  = [ \t\n\r]*

