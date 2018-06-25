//converts a directory of MusicXML to pdf
//note this script requires musescore which is not be available
//through npm
//execute like node musicxml2pdf.js ../musicxml_scores ../pdf_scores
const exec = require("child_process").exec;
const fs = require("fs");

const xmlScoresDir = process.argv[2];
const pdfScoresDir = process.argv[3];
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

