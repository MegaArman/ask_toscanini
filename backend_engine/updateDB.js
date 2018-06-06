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
    collection.deleteMany(filterQueryObj).then(() => 
    {
      console.log(`deleted facts records ${filterQueryObj}`);
    }).catch((reason) =>
    {
      console.log(reason);
    });
  }

  //insert new scores
  const newScores = scoreNames.filter((scoreName) =>
    !scoreNamesInDB.includes(scoreName)); 
  const factsDB = [];
   
  newScores.forEach((scoreName) =>
  {
    //still read sync? This blocks!
    console.log(`analyzing new score ${scoreName}`);
    const musicxml = fs.readFileSync(scoreDir + scoreName);
    const scoreFacts = computeFacts(musicxml);
    scoreFacts["_id"] = scoreName;
    factsDB.push(scoreFacts);
  });
  
  if (factsDB.length > 0)
  {
    collection.insertMany(factsDB).then(()=>
    {
      console.log("successfully inserted the new scores' facts");
    });
  }
  

  //return factsDB.length > 0 ? collection.insertMany(factsDB) : null;
})
.then(() => 
{
  console.log("no errors, closing connection to db...");
  clientRef.close();
})
.catch((reason) =>
{
  console.log(reason);
  console.log("closing connection to db...");
  clientRef.close();
});

