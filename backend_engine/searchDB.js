const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
//const musicql = require("./musicql.js");

const url = "mongodb://localhost:27017";
const dbName = "askToscanini";
const collectionName = "scoreFacts";

const findDocuments = function(db, callback) 
{
  // Get the documents collection
  const collection = db.collection(collectionName);

  collection.find(
    {"$and":
    [{"_id":{"$regex":"beethoven"}}, 
    {"minTempo":{"$gte":70}},{"maxTempo":{"$lte":170}},
    {"instrumentRanges.instrumentName":{"$regex":"flute"},
     "instrumentRanges.minPitch":{"$gte":50},
     "instrumentRanges.maxPitch":{"$lte":80}},
    {"instrumentRanges.instrumentName":{"$regex":"trumpet"},
    "instrumentRanges.minPitch":{"$gte":42},
    "instrumentRanges.maxPitch":{"$lte":69}},
    {"keySignatures":"Bb"}, 
    {"timeSignatures":{"beats":2,"beatType":4}}
    ]}) 
    .project({_id: 1})
    .toArray(function(err, docs) 
    {
      assert.equal(err, null);
      console.log("Found the following scores");
      console.log(docs);
      callback(docs);
  });
};

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) 
{
  assert.equal(null, err);
  console.log("Connected successfully to server");
 
  const db = client.db(dbName);
  findDocuments(db, function()
  {
    client.close();
  });
});
