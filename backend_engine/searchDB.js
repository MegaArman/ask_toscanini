const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const MQL = require("./musicql.js");

const url = "mongodb://localhost:27017";
const dbName = "askToscanini";
const collectionName = "scoreFacts";


// Use connect method to connect to the server
module.exports = (queryString) =>
  {
  MongoClient.connect(url, function(err, client) 
  {
    const findDocuments = function(db, callback) 
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
          console.log("Found the following scores");
          console.log(docs);
          callback(docs);
      });
    };

    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    findDocuments(db, function()
    {
      client.close();
    });
  });
};
