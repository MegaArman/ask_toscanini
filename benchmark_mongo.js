"use strict";
const fs = require("fs");
const MongoClient = require("mongodb").MongoClient;
const numRuns = 10;
const dbURL = "mongodb://localhost:27017";

const NS_PER_SEC = 1e9;
const result = {"runTimes": []};
let db;

MongoClient.connect(dbURL, {useNewUrlParser: true},
function(err, client) 
{
  if(err) throw err;
  db = client.db("askToscanini");

  for (let i = 0; i < numRuns; i++)
  {
    const mongoQueryObj = {};

    const preSearchTime = process.hrtime();

    // console.log("mongoQueryObj", JSON.stringify(mongoQueryObj));
    db.collection("scoreFacts").distinct("_id", mongoQueryObj,
    (err, scoreNames) =>
    { 
      if (err) console.log(err);
      const diffSearchTime = process.hrtime(preSearchTime);
      const searchTime = diffSearchTime[0] * NS_PER_SEC + diffSearchTime[1];
      result.runTimes.push(searchTime);

      if (i + 1 === numRuns)
      {
        fs.writeFileSync("benchmark_mongo.json", JSON.stringify(result));
      }
    });
  }//end loop
  client.close();
});

