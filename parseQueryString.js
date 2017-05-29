//The goal of this file is to create a query like
//{"flute": {"minPitch": 50, "maxPitch": 80},
//"viola": {"minPitch": 40, "maxPitch": 74}};
//from a string like "flute 50 80 and viola 40 74"
//if the query string is invalid, a string containing "ERROR" 
//will be returned
function ascii(c)
{
  return c.charCodeAt(0);
}

const noteToMIDI = 
{
  "C": 0,
  "C#": 1,
  "Db": 1,
  "D": 2,
  "D#": 3,
  "Eb": 3,
  "E": 4,
  "E#": 5,
  "Fb": 4,
  "F": 5,
  "F#": 6,
  "Gb": 6,
  "G": 7,
  "G#": 8,
  "Ab": 8,
  "A": 9,
  "A#": 10,
  "Bb": 10,
  "B": 11,
  "B#": 0, //B# in octave 0 corresponds to C in octave 0
  "Cb": 11 //Cb in octave 1 corresponds to B in octave 1
};

//noteOctave, ex: C2
function noteOctaveToMIDI(noteOctave)
{
  let pitch;
  let accidental;
  let octave;

  pitch = noteToMIDI[noteOctave.charAt(0).toUpperCase()];
  
  //has accidental
  if (noteOctave.length === 3)
  {
    if (noteOctave.charAt(1) === "b")
    {
      accidental = -1;
    }
    if (noteOctave.charAt(1) === "#")
    {
      accidental = 1;
    }
    octave = parseInt(noteOctave.charAt(2));  
  }
  //no accidental
  else if (noteOctave.length === 2)
  {
    accidental = 0;
    octave = parseInt(noteOctave.charAt(1));
  }

  const MIDI = pitch + accidental + 12 * octave;
  return MIDI;
}

module.exports = (queryString) =>
{
  const queryObject = {};
  let errorString = "bad query";

  //take the input string, flute 34 70 and guitar 30 90 and output
  //=>[ [ 'flute', '34', '70' ], [ 'guitar', '30', '90' ] ]
  const queryConditionMatrix = queryString.split("and").map((queryPartString) =>
    //remove duplicate spaces and split
    queryPartString.toLowerCase().replace(/\s+/g, " ").trim().split(" ")
  );

  const validQuery = queryConditionMatrix.every((queryCondition) => 
  { 
    let validQuery = true;

    if (queryCondition[0] === "composer" && queryCondition.length === 2 && 
        !("composer" in queryObject))
    {
      queryObject["composer"] = queryCondition[1];
    }
    else if (queryCondition[0] === "tempo" && queryCondition.length === 3 && 
             !("tempo" in queryObject))
    {
      queryObject["tempo"] = {}; 
      queryObject["tempo"]["min"] = parseInt(queryCondition[1]);
      queryObject["tempo"]["max"] = parseInt(queryCondition[2]);
    }
    else if (queryCondition[0] === "key" && queryCondition.length === 2 &&
             !("key" in queryObject))
    {
      queryObject["key"] = queryCondition[0];
    }
    else
    {
      errorString = queryCondition[0];
      return validQuery = false;
    }
    return validQuery;
  });
 
  if (validQuery)
  { 
    return queryObject;
  }
  else
  {
    return "ERROR: " + errorString;
  }
};

