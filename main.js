const request = require('request');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');

const getAllMatcheObj = require('./allMatches');
let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595"

request(url,cb);

function cb(err,res,body){
    if(err){
        console.error("error",err);
    }
    else{
        handleHtml(body);
    }
}

let iplPath = path.join(__dirname,"IPL");//__dirname prints the current path of the file in which we are using this
if(!fs.existsSync(iplPath)){
    fs.mkdirSync(iplPath);
}

function handleHtml(html){
    let selecTool = cheerio.load(html);

    // we get these selectors by actually inspecting the element on the website we are scrapping. We look for unique slecetor for the element we need 
    let anchorElement = selecTool("a[data-hover='View All Results']");
    // console.log(anchorElement.html());

    //attr methods -> Method for getting all attributes and their values
    let relativeLink = anchorElement.attr("href");//href is another attribute which is present in acnhor element
    // console.log(relativeLink);
    let fullLink = "https://www.espncricinfo.com/" + relativeLink;
    // console.log(fullLink);
    getAllMatcheObj.getAllMatches(fullLink);


}