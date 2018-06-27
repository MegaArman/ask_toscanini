"use strict";
const MongoClient = require("mongodb").MongoClient;
const numRuns = 10;
const dbURL = "mongodb://localhost:27017";
const NS_PER_SEC = 1e9;

MongoClient.connect(dbURL, {useNewUrlParser: true}).
then((client) =>
{
  const db = client.db("askToscanini");
  
  //promise returing function
  const getSearchTime = (() =>
  {
     const preSearchTime = process.hrtime();
     return db.collection("scoreFacts").distinct("_id")
     .then(() =>
     {
      //note, res should be logged if db has changed to make sure still correct
      const diffSearchTime = process.hrtime(preSearchTime);
      const searchTime = diffSearchTime[0] * NS_PER_SEC + diffSearchTime[1];
      return searchTime;
     });
  });
    
  const funcs = Array(numRuns).fill(getSearchTime);
  
  Promise.all(funcs.map((f) => f.apply()))
    .then(res => console.log(res))
    .catch((err) => console.log(err));

  client.close();
})
.catch((err) => console.log(err));

