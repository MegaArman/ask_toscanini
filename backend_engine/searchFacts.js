//The goal of searchFacts is to search facts produced
//by writeFacts
"use strict";
const fs = require("fs");
const path = require("path");
const factsJSON = fs.readFileSync(path.resolve(__dirname,"./facts.json"));
const factsDB = JSON.parse(factsJSON);

//queries of form {"flute": {"minPitch": 50, "maxPitch": 80}};
module.exports = (query) => //ex: invoked w searchFacts(query)
{
  console.time("Took");

  //extract info from query====================================
  //TODO: this step should not be needed
  if (query === "lucky")
  {
    //get # between 0 and factsMap.length - 1
    const randomNum = Math.floor(Math.random() * (factsDB.length));
    const randomScore = Object.keys(factsDB[randomNum]);   
    return randomScore;
  }
    
  let queryComposer;
  if ("composer" in query)
  {
    queryComposer = query["composer"];
    delete query["composer"];
  }
  
  let queryTempo;
  if ("tempo" in query)
  {
    queryTempo = query["tempo"];
    delete query["tempo"];
  }

  let queryKey;
  if ("key" in query)
  {
    queryKey = query["key"];
    delete query["key"];
  }
  
  let queryTimeSignature;
  if ("timeSignature" in query)
  {
    queryTimeSignature = query["timeSignature"];
    delete query["timeSignature"];
  }

  const queryInstrumentNames = Object.keys(query);
  //==========================================================
  //iterate over pieces in our facts database
  //................value, key
  const matchingScores = factsDB.reduce((acc, scoreTuple) =>
  { 
    const scoreName = Object.keys(scoreTuple)[0];
    const facts = scoreTuple[scoreName];

    const hasComposer = queryComposer === undefined || 
      queryComposer.length === 0 ||
      scoreName.toLowerCase().includes(queryComposer);

    const hasTempoRange = queryTempo === undefined || 
      facts["tempos"].every(tempo => 
        tempo >= queryTempo["min"] && tempo <= queryTempo["max"]);  
    
    const hasKey = queryKey === undefined ||
      facts["keySignatures"].includes(queryKey);

    const hasTimeSignature = queryTimeSignature === undefined ||
      facts["timeSignatures"].some((timeSignature) =>
        (queryTimeSignature[0] === timeSignature[0] && 
         queryTimeSignature[1] === timeSignature[1])
      );

    const scoreInstrumentNames = Object.keys(facts["instrumentRanges"]);
    const allInstrumentsPass = queryInstrumentNames.length === 0 ||
      queryInstrumentNames
      .every((queryInstrumentName) =>
      {
        const equivalentInstrumentName = scoreInstrumentNames
          .find((scoreInstrumentName) =>
           scoreInstrumentName.includes(queryInstrumentName));

        if (equivalentInstrumentName === undefined)
        {
          return false;
        }

        const minPitch = 
          facts["instrumentRanges"][equivalentInstrumentName]["minPitch"];
        const maxPitch = 
          facts["instrumentRanges"][equivalentInstrumentName]["maxPitch"];
        const queryMinPitch = query[queryInstrumentName]["minPitch"];
        const queryMaxPitch = query[queryInstrumentName]["maxPitch"];

        return (minPitch >= queryMinPitch && maxPitch <= queryMaxPitch);
      });

    return (hasComposer && hasTempoRange && hasKey && hasTimeSignature && 
             allInstrumentsPass) ? acc.concat(scoreName): acc; 
  }, []);
 
 console.timeEnd("Took");
 return matchingScores;
};
