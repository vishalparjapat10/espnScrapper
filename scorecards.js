const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

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
    
    let desc = selecTool(".match-header-info.match-info-MATCH");
    // 1) get match no
    let whichMatch = desc.text().split(',')[0];
    const newL = whichMatch.slice(6);
    if(newL.split(' ')[0].length == 3 || newL.split(' ')[0].length == 4){
        if(newL.split(' ')[0].length == 3){
            // console.log(whichMatch.split(' ')[0]);
            whichMatch = whichMatch.slice(6,15);
        }
        else if(newL.split(' ')[0].length == 4){
            whichMatch = whichMatch.slice(6,16);
        }
    }
    else if(whichMatch.includes('Final')){
        whichMatch = whichMatch.slice(6,11);
    }
    else if(whichMatch.includes('Qualifier')){
        whichMatch = whichMatch.slice(6,17);
    }
    else if(whichMatch.includes('Eliminator')){
        whichMatch = whichMatch.slice(6,16);
    }
    console.log(whichMatch);

    // 2) get team names
    let teamNames = selecTool('.name-detail>.name-link');
    let team1 = selecTool(teamNames[0]).text();
    let team2 = selecTool(teamNames[1]).text();
    console.log(`${team1} vs ${team2}`);
    // 3) get venue
    let descArr = desc.text().split(',');
    let venueOfMatch = descArr[1];
    // 4) get date
    let dateOfMatch = descArr[2];
    console.log("Venue of the match :-",venueOfMatch);
    console.log("Date of the match :-",dateOfMatch);
    // 5) get result
    let matchResElem = selecTool(".match-info.match-info-MATCH.match-info-MATCH-half-width>.status-text");
    let resultOfMatch = matchResElem.text()
    console.log("Result of the match :- ",resultOfMatch);

    // 6) get innings
    let allBatsmenTable = selecTool('.table.batsman tbody');
    // console.log(allBatsmenRows.text());
    let htmlString = "";
    
    for(let i = 0;i < allBatsmenTable.length;i++){
        htmlString += selecTool(allBatsmenTable[i]).html();
        console.log("Innings of team ",selecTool(teamNames[i]).text()+" :-");
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

            //    console.log(`${playerName} | ${runs} runs | ${balls} balls | ${numOf4} 4's | ${numOf6} 6's | ${sr} strike rate`);

            processInformation(dateOfMatch,venueOfMatch,resultOfMatch,team1,team2,playerName,runs,balls,numOf4,numOf6,sr);
            }
        }
    }

    function processInformation(dateOfMatch,venueOfMatch,resultOfMatch,team1,team2,playerName,runs,balls,numOf4,numOf6,sr){
        let teamNamePath = path.join(__dirname,"IPL",team1);
        if(!fs.existsSync(teamNamePath)){
            fs.mkdirSync(teamNamePath);
        }
        let playerPath = path.join(teamNamePath,playerName+".xlsx");
        let content = excelReader(playerPath,playerName);

        let playerObj = {
            dateOfMatch,
            venueOfMatch,
            resultOfMatch,
            team1,
            team2,
            playerName,
            runs,
            balls,
            numOf4,
            numOf6,
            sr
        }
        content.push(playerObj);
        excelWriter(playerPath,content),playerName;
    }

    function excelReader(playerPath,playerName){
        if(!fs.existsSync(playerPath)){
            return [];
        }
    }

    function excelWriter(playerPath,jsObject,sheetName){
        let newWorkBook = xlsx.utils.book_new();// from this we wil get new excel file/book
        let newWorkSheet = xlsx.utils.json_to_sheet(jsonData);// converts an array of JS objects to a worksheet,[{}]
        xlsx.utils.book_append_sheet(newWorkBook,newWorkSheet,sheetName);// it will create/append new sheet to the same excel sheet
        xlsx.writeFile(newWorkBook,playerPath);// now it will move this workbook we hve created at the path playerPath
    }
    
}
module.exports = {
    gifs:getInfoFromScorecard,
}