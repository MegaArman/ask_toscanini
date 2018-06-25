//converts a directory of MusicXML to pdf
const exec = require("child_process").exec;
const fs = require("fs");

const xmlScoresDir = "./musicxml_scores/";
const pdfScoresDir = "./pdf_scores/";
const xmlPieceNames = fs.readdirSync(xmlScoresDir);

xmlPieceNames.forEach((xmlPieceName) =>
{
  const pdfName = xmlPieceName.replace(".xml", ".pdf");
	
  exec("musescore " + xmlScoresDir + xmlPieceName + " -o " 
       + pdfScoresDir + pdfName,
    (error, stdout, stderr) =>
    {
      //musescore may cause errors (segfaults)
      //but may still produce the pdfs- just be aware...
      console.log("stdout: " + stdout);
      console.log("stderr: " + stderr);

      if (error !== null) 
      {
        console.log("exec error: " + error);
      }
    });
});

