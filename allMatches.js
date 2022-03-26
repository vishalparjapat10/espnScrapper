const request = require('request');
const cheerio = require('cheerio');
const getInfoFromScorecard = require('./scorecards');
// OR
// const {gifs} = require('./scorecards');// then we can directly use gifs() as a function without using any object

function getAllMatches(url){
    request(url,cb)
}

function cb(err,res,body){
    if(err){
        console.error("error",err);
    }
    else{
        extractAllMatchLink(body);
    }
}

function extractAllMatchLink(html){
    let selecTool = cheerio.load(html);

    // we get these selectors by actually inspecting the element on the website we are scrapping. We look for unique selector for the element we need 
    let scoreCardElemArr = selecTool('a[data-hover="Scorecard"]');

    for(let i = 0;i < scoreCardElemArr.length;i++){
        let scoreCardLink = selecTool(scoreCardElemArr[i]).attr('href');// if scoreCardElemArr is only a single element then we need not to use selecTool(scoreCardElemArr) in this, we can directly use scoreCardElement.attr()
        
        let fullLink = "https://www.espncricinfo.com/" + scoreCardLink;// full link for scorecard for a match
        // console.log(fullLink);
        getInfoFromScorecard.gifs(fullLink);  
        break;  
    }
    


}
//data-hover="Scorecard"

module.exports = {
    getAllMatches:getAllMatches,
}