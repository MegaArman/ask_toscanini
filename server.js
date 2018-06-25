"use strict";
const http = require("http");
const fs = require("fs");
const MongoClient = require("mongodb").MongoClient;
const MQL = require("./backend/musicql.js");

let db;
//7999 for dev and 1867 for prod
const port = 7999;
const pdfDir = "/pdf_scores/";
const musicxmlDir = "/musicxml_scores/";

function send404Response(response)
{
  response.writeHead(404,{"Content-Type": "text/plain"});
  response.write("Error 404: Page not found");
  response.end();
}

function onRequest(request, response)
{
  if (request.method === "GET")
  {
    if (request.url === "/")
    {
      response.writeHead(200, {"Content-Type": "text/html"});
      fs.createReadStream("./frontend/index.html").pipe(response);
    }
    else if (request.url === "/info")
    {
      response.writeHead(200, {"Content-Type": "text/html"});
      fs.createReadStream("./frontend/info.html").pipe(response);
    }
    else if (request.url ==="/materialize.css")
    {
      response.writeHead(200, {"Content-Type": "text/css"});
      fs.createReadStream("./frontend/materialize.css").pipe(response);
    }
    else if (request.url ==="/styles.css")
    {
      response.writeHead(200, {"Content-Type": "text/css"});
      fs.createReadStream("./frontend/styles.css").pipe(response);
    }
    else if (request.url === "/main.js")
    {
      response.writeHead(200, {"Content-Type": "text/javascript"});
      fs.createReadStream("./frontend/main.js").pipe(response);
    }
    else if (request.url.includes(musicxmlDir)
             && request.url.includes(".xml"))
    {
      const scoreName = request.url.replace(musicxmlDir, "");
      const relPath = "." + musicxmlDir + scoreName;
      const readStream = fs.createReadStream(relPath);
      
      readStream.on("open", ()=>
      {
        response.writeHead(200, {"Content-Type": "text/xml"});
        readStream.pipe(response);
      });

      readStream.on("error", () =>
      {
        send404Response(response);
        console.log("xml not found " + relPath);
      }); 
    }
     else if (request.url.includes(pdfDir)
           && request.url.includes(".pdf"))
    {
      const scoreName = request.url.replace(pdfDir, "");
      const relPath = "." + pdfDir + scoreName;
      const readStream = fs.createReadStream(relPath);
      
      readStream.on("open", ()=>
      {
        response.writeHead(200, {"Content-Type": "application/pdf"});
        readStream.pipe(response);
      });

      readStream.on("error", () =>
      {
        send404Response(response);
        console.log("pdf not found " + relPath);
      }); 
    }
    else
    {
      send404Response(response);
    }
  }
  else if (request.method === "POST")
  {
    let requestBody = "";
    request.on("data", (data)=> 
    {
      requestBody += data;

      if (requestBody.length > 256) //
      {
        response.writeHead(413, "Request Entity Too Large",
                                {"Content-Type": "text/html"});
        response.end("<html>failed</html>");
      }
    });
    request.on("end", ()=> 
    {
      console.log("requestBody", requestBody);
      response.writeHead(200, {"Content-Type": "text/plain"}); 
      const queryString = requestBody.toLowerCase(); 
      
      try 
      {
        console.time("took");
        const mongoQueryObj = 
          (queryString === "lucky" || queryString.length === 0) ? 
          {} : MQL.parse(queryString)[1];
    
        console.log("mongoQueryObj", JSON.stringify(mongoQueryObj));
        db.collection("scoreFacts").distinct("_id", mongoQueryObj,
          (err, scoreNames) => 
          {
            if (err) console.log(err);
            let result;

            if (queryString === "lucky")
            {
              const randomNum = Math.floor(Math.random() * scoreNames.length);
              result = scoreNames[randomNum];
            }
            else
            {
              result = JSON.stringify(scoreNames);
            }
            
            console.timeEnd("took");
            response.end(result);
            console.log("result", result);
          });
      }
      catch (err)
      {
        const errPos = err.location.start.offset;
        const beforeAndIndex = queryString.substr(0, errPos).lastIndexOf("and");
        //condition should account for clause being first 
        const clauseStart = (beforeAndIndex !== -1) ? beforeAndIndex + 3 : 0;
        const afterAnd = queryString.substr(clauseStart, queryString.length)
          .indexOf("and");
        //condition should account for clause being last
        const clauseEnd = (afterAnd !== -1) ? afterAnd : queryString.length;
        const errorClause = queryString.substr(clauseStart, clauseEnd); 
        const semanticError = err.expected[0].description;
        const errReponsObj = 
          {errorClause : errorClause, semanticError: semanticError};

        console.log("errResponseObj", JSON.stringify(errReponsObj));
        response.end(JSON.stringify(errReponsObj));
      }
    });
  }
  else
  {
    console.log("bad request, will send 404");
    send404Response(response);
  }
}

MongoClient.connect("mongodb://localhost:27017", 
function(err, client) 
{
  if(err) throw err;

  db = client.db("askToscanini");

  const server = http.createServer(onRequest);

  // Listen on port, IP defaults to 127.0.0.1
  server.listen(port);

  // Put a friendly message on the terminal
  console.log("Server running at http://127.0.0.1:" + port + "/");
});

