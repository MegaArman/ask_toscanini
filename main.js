//The goal of this file is to submit a  query of format
//{"flute": {"minPitch": 50, "maxPitch": 80}, 
//"viola": {"minPitch": 40, "maxPitch": 74}};

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
        let dir = "./scores/";

        if($("#test1").is(":checked")) 
        {
          scoreName = scoreName.replace(".xml", ".pdf");
          dir = "./scores_pdf/"; 
        }

        $("#matchingScores").append("<a href='" + dir + scoreName + "'" +  
          "class='download collection-item'" + "download>"
          + scoreName + "</a>"); 
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

      $("#matchingScores").append("<a href='./scores/" + scoreName + "'" +  
        "class='download collection-item'" + "download>" + scoreName + "</a>"); 
    },      
    error: () => alert("no response from server")
  });
});
