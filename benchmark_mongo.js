"use strict";
const MongoClient = require("mongodb").MongoClient;
const MQL = require("./backend/musicql.js");

const queryString = "tempo 100 150";
let db;

MongoClient.connect("mongodb://localhost:27017", {useNewUrlParser: true},
function(err, client) 
{
  if(err) throw err;
  db = client.db("askToscanini");

  console.time("took");
  for (let i = 0; i < 100; i++)
  {
    const mongoQueryObj = MQL.parse(queryString)[1];

    // console.log("mongoQueryObj", JSON.stringify(mongoQueryObj));
    db.collection("scoreFacts").distinct("_id", mongoQueryObj,
    (err, scoreNames) =>
    { 
      if (err) console.log(err);
      let result;
      result = JSON.stringify(scoreNames);
      //console.log("done " + i); //proof time is being measured correct
      console.timeEnd("took");
      console.time("took");
    });
  }//end loop
  client.close();
});

