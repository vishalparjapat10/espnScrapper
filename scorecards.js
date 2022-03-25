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
}
module.exports = {
    gifs:getInfoFromScorecard,
}