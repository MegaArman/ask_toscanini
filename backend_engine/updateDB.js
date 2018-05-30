const path = require("path");
const fs = require("fs");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

// Connection URL
const url = "mongodb://localhost:27017";
 
// Database Name
const dbName = "askToscanini";

//make db from facts.json
const factsPath = "./backend_engine/facts.json";
const factsJSON = fs.readFileSync(path.resolve(__dirname, factsPath));
const factsObj = JSON.parse(factsJSON);
const insertDocuments = function(db, callback) 
{
  // Get the documents collection
  const collection = db.collection("scoreFacts");

  // Insert some documents
  collection.insertMany(factsObj, function(err, result) 
  {
    assert.equal(err, null);
    console.log("Inserted facts about the scores");
    callback(result);
  });
};

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) 
{
  assert.equal(null, err);
  console.log("Connected successfully to server");
 
  const db = client.db(dbName);

  insertDocuments(db, function() 
  {
    client.close();
  });
});
