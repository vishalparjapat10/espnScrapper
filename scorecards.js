const request = require('request');
const cheerio = require('cheerio');

function getInfoFromScorecard(url){
    // Now we have link of the scorecard of a match, we want to get html pf that scorecard
    request(url,cb)
}

function cb(err,res,body){
    if(err){
        console.error(err);
    }
    else{
        getMatchDetails(body);
    }
}

function getMatchDetails(html){

    let selecTool = cheerio.load(html);

    // 1) get venue
    let desc = selecTool(".match-header-info.match-info-MATCH");
    // console.log(desc.text().split(',')[1]);
    let descArr = desc.text().split(',');
    let venueOfMatch = descArr[1];
    // 2) get date
    let dateOfMatch = descArr[2];
    console.log("Venue of the match :-",venueOfMatch);
    console.log("Date of the match :-",dateOfMatch);
    // 3) get team names
    let teamNames = selecTool('.name-detail>.name-link');
    // console.log(teamNames.text());
    let team1 = selecTool(teamNames[0]).text();
    let team2 = selecTool(teamNames[1]).text();
    console.log("Teams are :-");
    console.log(team1);
    console.log(team2);
    // 4) get result
    let matchResElem = selecTool(".match-info.match-info-MATCH.match-info-MATCH-half-width>.status-text");
    let resultOfMatch = matchResElem.text()
    console.log("Result of the match :- ",resultOfMatch);

    // 5) get innings
    let allBatsmenTable = selecTool('.table.batsman tbody');
    // console.log(allBatsmenRows.text());
    let htmlString = "";
    let count = 0;
    for(let i = 0;i < allBatsmenTable.length;i++){
        htmlString += selecTool(allBatsmenTable[i]).html();
        let allRows = selecTool(allBatsmenTable[i]).find("tr");//Get the descendants(table rows) of each element(table) i.e this will get all <tr> in an ith table
        for(let j = 0;j < allRows.length;j++){
            let row = selecTool(allRows[j]);
            let firstColumnOfRow = row.find("td")[0];
            // hasClass() :- check to see if any of the matched elements have the given className
            if(selecTool(firstColumnOfRow).hasClass("batsman-cell")){
                let playerName = selecTool(row.find("td")[0]).text();
                let runs = selecTool(row.find("td")[2]).text();
                let balls = selecTool(row.find("td")[3]).text();
                let numOf4 = selecTool(row.find("td")[5]).text();
                let numOf6 = selecTool(row.find("td")[6]).text();
                let sr = selecTool(row.find("td")[7]).text();

               console.log(`${playerName} | ${runs} runs | ${balls} balls | ${numOf4} 4's | ${numOf6} 6's | ${sr} strike rate`);
            }
        }
    }
}
module.exports = {
    gifs:getInfoFromScorecard,
}