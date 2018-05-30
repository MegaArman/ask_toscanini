const musicql = require("./musicql.js");


let queryString = "bach ai and flute";
try 
{
  const result =   musicql.parse(queryString);
  console.log("success" + JSON.stringify(result[1]));
}
catch (e)
{
  //const errPos = e.location.start.offset;
  //err clause can be first, middle, or last...
  //start
  const indexOfAnd = queryString.indexOf("and");
  queryString = queryString.substr(indexOfAnd + 3);
  console.log("corrected : " + queryString);
}
