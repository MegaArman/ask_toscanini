console.time("took");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const MQL = require("./musicql.js");

const url = "mongodb://localhost:27017";
const dbName = "askToscanini";
const collectionName = "scoreFacts";

const findDocuments = function(db, queryString, callback) 
{
  // Get the documents collection
  const collection = db.collection(collectionName);
  let mongoQueryObj; 
  try 
  {
    mongoQueryObj = MQL.parse(queryString)[1];
  }
  catch (e)
  {
    console.log(e);
    return "cannot search on this string";
  }

  collection.find(mongoQueryObj) 
    .project({_id: 1})
    .toArray(function(err, docs) 
    {
      assert.equal(err, null);
      callback(docs);
  });
};


// Use connect method to connect to the server
module.exports = (queryString, cb) =>
{
  MongoClient.connect(url,function(err, client) 
  {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    findDocuments(db, queryString, function(docs)
    {
      cb(docs);
      client.close();
      console.timeEnd("took");
    });
  });
};


