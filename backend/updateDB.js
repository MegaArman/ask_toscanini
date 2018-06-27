//invoke with "node updateDB.js ..path to scoredir"
const fs = require("fs");
const MongoClient = require("mongodb").MongoClient;
const computeFacts = require("./computeFacts.js");

const scoreDir = process.argv[2];
const scoreNames = fs.readdirSync(scoreDir);
const url = "mongodb://localhost:27017";
const dbName = "askToscanini";
const collectionName = "scoreFacts_test"; //can change for testing purposes

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

  (filterQueryObj.$or.length > 0) &&
    (()=>
    {
       console.log("will delete records from db as they no longer exist",
        filterQueryObj.$or);
       bulkWriteOperations.push({"deleteMany": {"filter": filterQueryObj}}); 
    })();

  //insert new scores
  const newScores = scoreNames.filter((scoreName) =>
    !scoreNamesInDB.includes(scoreName)); 
  const factsDB = newScores.map((scoreName) =>
  {
    console.log(`will insert facts record for ${scoreName}`);
    //still read sync? This blocks!
    const musicxml = fs.readFileSync(scoreDir + scoreName);
    const scoreFacts = computeFacts(musicxml);
    scoreFacts["_id"] = scoreName;
    return scoreFacts;
  });
 
  (factsDB.length > 0) &&
    bulkWriteOperations.push(...factsDB.map(doc => ({"insertOne": doc})));
  

  const promiseOrFalse = (bulkWriteOperations.length > 0) ?
    collection.bulkWrite(bulkWriteOperations, {"ordered": false})
    :
    console.log("nothing to do");

  return promiseOrFalse; 
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

