//The goal of searchFacts is to search facts produced
//by writeFacts
"use strict";
const fs = require("fs");
const factsJSON = fs.readFileSync("./facts.json");
const factsDB = JSON.parse(factsJSON);

//queries of form {"flute": {"minPitch": 50, "maxPitch": 80}};
module.exports = (query) => //ex: invoked w searchFacts(query)
{
  console.time("Took");
  if (query["composer"] === "lucky")
  {
    //get # between 0 and factsMap.length - 1
    const r = Math.floor(Math.random() * (factsDB.length));
    let randomScore = "";  

    for (let i = 0; i < r; i++)
    {
      randomScore = Object.keys(factsDB[r])[0];
    } 
    
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

  const queryInstrumentNames = Object.keys(query);
 
  //iterate over pieces in our facts database
  //................value, key
  const matchingScores = factsDB.map((scoreFacts) =>
  { 
    const scoreName = Object.keys(scoreFacts)[0];
    const facts = scoreFacts[scoreName];
    
    //check if our piece is by the composer they want
    if (queryComposer && !scoreName.toLowerCase().includes(queryComposer))
    {
      return false;
    }

    //check if our piece has a tempo range they want
    if (queryTempo)
    {
      const temposInRange = facts["tempos"].every(tempo =>
        (tempo >= queryTempo["minPitch"] || tempo <= queryTempo["maxPitch"]));
     
      if (!temposInRange)
      {
        return false;
      } 
    }
    
    //check if our piece has the key they want
    //indexOf returns -1 if doesn't exist
    if (queryKey && facts["keySignatures"].indexOf(queryKey) === -1)
    {
      return false;
    }

    //see if piece has query instruments and if they're in range
    //to do so we need to check substrings, 
    //so "trumpet in C" passes for query "trumpet"
    const scoreInstrumentNames = Object.keys(facts["instrumentRanges"]);
     
    const allInstrumentsPass = queryInstrumentNames
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

      if (minPitch < queryMinPitch || maxPitch > queryMaxPitch)
      {
       return false;
      }        

      return true;
    });

    if (!allInstrumentsPass)
    {
      return false;
    }

    return scoreName;
  });
  
 console.timeEnd("Took");
 return matchingScores;
};
