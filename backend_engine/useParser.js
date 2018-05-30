let musicQL = require("./musicql.js");


//algorithm to continue parsing even on failed clause:
//1)assign to queryObj
//2)remove everything from query up until next clausec
const result = musicQL.parse("Beethoven and tempo 70 170 and flute D4 G#6" + 
  " and trumpet F#3 A5 and key Bb and ts 2 4");
console.log(JSON.stringify(result[1]));

