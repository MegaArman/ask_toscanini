//submit query strings to server...

const pdfDir = "./pdf_scores/";
const musicxmlDir = "./musicxml_scores/";

function makeScoreDownloadLink(scoreName) 
{
 const dir = scoreName.includes("pdf") ? pdfDir : musicxmlDir;
 return "<a href='" + dir + scoreName + "'" +  
         "class='download collection-item'" + "download>"+ scoreName + "</a>";
}

$("#search").on("keyup", (e) =>
{
  if (e.keyCode === 13)
  {
   return false;
  }
});

$("#ask").on("click", ()=> 
{   
  const queryString = $("#search").val();
  $.ajax(
  {
    type: "POST",
    url: "/",
    data: queryString,
    success: (result) => 
    {
      $(".download").remove();
      $("#resultsFor").text("Showing results for ");
      $("#query").text($("#search").val()); 
 
      if (result.includes("ERROR"))
      {
        alert(result);
        return;
      }
      const scores = JSON.parse(result);
                          
      scores.forEach((scoreName) =>
      {
        if($("#test1").is(":checked")) 
        {
          scoreName = scoreName.replace(".xml", ".pdf");
        }

        $("#matchingScores").append(makeScoreDownloadLink(scoreName)); 
      });
    },      
    error: () => alert("no response from server")
  });
});

$("#lucky").on("click", () =>
{
  $.ajax(
  {
    type: "POST",
    url: "/",
    data: "lucky",
    success: (scoresJSON) => 
    {
      $(".download").remove();
      $("#resultsFor").text("It's your lucky day!!!");
      $("#query").text("");

      let scoreName = JSON.parse(scoresJSON);

      if($("#test1").is(":checked"))
      {
        scoreName = scoreName.replace(".xml", ".pdf");
      }

      $("#matchingScores").append(makeScoreDownloadLink(scoreName)); 
    },      
    error: () => alert("no response from server")
  });
});
