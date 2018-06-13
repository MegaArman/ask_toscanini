//submit query strings to server...

const pdfDir = "./pdf_scores/";
const musicxmlDir = "./musicxml_scores/";

function makeScoreDownloadLink(scoreName) 
{
 const dir = scoreName.includes("pdf") ? pdfDir : musicxmlDir;
 return `<a href=${dir + scoreName} class="download collection-item"  
          download> ${scoreName}</a>`;
}

function makeSuggestionListItem(itemText, errClause)
{
  return `<li>${itemText} <i>${errClause}</i> </li>`;   
}


const submitQuery = () =>
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
            
      const resultObj = JSON.parse(result);

      if (resultObj.error)
      {
        $("#suggestionsList").empty();

        $("#resultsFor").text("No results found for ");
        $("#query").text($("#search").val());
        $("#suggestionsDiv").css("display", "block");
        $("#suggestionsList")
          .append(makeSuggestionListItem("check condition", resultObj.error));
      }
      else
      {
        $("#suggestionsDiv").css("display", "none");
        $("#resultsFor").text("Showing results for ");
        $("#query").text($("#search").val()); 
        const scores = JSON.parse(result);
                          
        scores.forEach((scoreName) =>
        {
          if($("#test1").is(":checked")) 
          {
            scoreName = scoreName.replace(".xml", ".pdf");
          }

          $("#matchingScores").append(makeScoreDownloadLink(scoreName)); 
        });
      } 
    },      
    error: () => alert("no response from server")
  });
};

$("#search").on("keyup", (e) =>
{
  //enter key
  if (e.keyCode === 13)
  {
    submitQuery(); 
    return false;
  }
});



$("#ask").on("click", ()=> 
{   
  submitQuery();
});

$("#lucky").on("click", () =>
{
  $.ajax(
  {
    type: "POST",
    url: "/",
    data: "lucky",
    success: (result) => 
    {
      $(".download").remove();
      $("#resultsFor").text("It's your lucky day!!!");
      $("#query").text("");

      const scoreName = ($("#test1").is(":checked")) ?
        result.replace(".xml", ".pdf"): result;

      $("#matchingScores").append(makeScoreDownloadLink(scoreName)); 
    },      
    error: () => alert("no response from server")
  });
});
