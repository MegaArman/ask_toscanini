const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
 
// Connection URL
const url = "mongodb://localhost:27017";
 
// Database Name
const dbName = "askToscanini";

const findDocuments = function(db, callback) 
{
  // Get the documents collection
  const collection = db.collection("scoreFacts");
  // Find some documents

 // const input = "flute 30 65"
  const whereClause = {"instrumentRanges.flute.minPitch": {$gte:30}};  
  //collection.find({"instrumentRanges.flute.minPitch": {$gte:30}})
  //.project({"instrumentRanges.flute.minPitch": 1})
  collection.find(whereClause)
  .project({"_id": 1})
    .toArray(function(err, docs) 
  {
    assert.equal(err, null);
    const results = docs.map(tuple => tuple._id);
    callback(results);
  });
};

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) 
{
  assert.equal(null, err);
  console.log("Connected successfully to server");
 
  const db = client.db(dbName);

    findDocuments(db, function(results)
    {
      console.log("resultssss", results);
      client.close();
    });
});
