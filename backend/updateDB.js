//invoke with "node updateDB.js ..path to scoredir"
const fs = require("fs");
const MongoClient = require("mongodb").MongoClient;
const computeFacts = require("./computeFacts.js");

const scoreDir = process.argv[2];
const scoreNames = fs.readdirSync(scoreDir);
const url = "mongodb://localhost:27017";
const dbName = "askToscanini";
const collectionName = "scoreFacts";

let collection;
let clientRef;

MongoClient.connect(url).then((client) =>
{
  console.log("Connected successfully to server"); 
  clientRef = client;
  collection = client.db(dbName).collection(collectionName);
  return collection.distinct("_id", {});
})
.then((scoreNamesInDB) => 
{
  const bulkWriteOperations = [];
  
  //remove delete scores' fact records from db
  const deletedScores = scoreNamesInDB.filter((scoreName) =>
    !scoreNames.includes(scoreName));
  const deletedScoresWithId = deletedScores.map((deletedScore) => 
  {
    return {_id: deletedScore};
  });

  const filterQueryObj = {$or: deletedScoresWithId};

  if (filterQueryObj.$or.length > 0)
  {
     console.log("will delete records from db as they no longer exist",
      filterQueryObj.$or);
     bulkWriteOperations.push({"deleteMany": {"filter": filterQueryObj}}); 
  }

  //insert new scores
  const newScores = scoreNames.filter((scoreName) =>
    !scoreNamesInDB.includes(scoreName)); 
  const factsDB = [];
   
  newScores.forEach((scoreName) =>
  {
    //still read sync? This blocks!
    const musicxml = fs.readFileSync(scoreDir + scoreName);
    const scoreFacts = computeFacts(musicxml);
    scoreFacts["_id"] = scoreName;
    factsDB.push(scoreFacts);
  });
  
  if (factsDB.length > 0)
  {
    console.log("will insert fact records for ", newScores);
    bulkWriteOperations.push(...factsDB.map(doc => ({"insertOne": doc})));
  }

  if (bulkWriteOperations.length > 0 )
  {
    return collection.bulkWrite(bulkWriteOperations, {"ordered": false});
  }
  else 
  {
    console.log("nothing to do");
  }
})
.catch((reason) =>
{
  console.log(reason);
})
.then(() => 
{
  console.log("Done. Closing connection to db...");
  clientRef.close();
});

