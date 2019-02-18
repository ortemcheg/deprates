//TODOs are at the bottom
//make the logs colorful
const rp = require('request-promise');
const parseHtml = require('./helpers/parseHtml');
const harvestResponses = require('./helpers/harvestResponses');
const requestXMLs = require('./helpers/requestXMLs');
const splitMultipleAndSingleSiteOwners = require('./helpers/splitMultipleAndSingleSiteOwners');

const reqOptions = {
  url: 'http://cbr.ru/credit/CO_SitesFull.asp',
  headers: {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A'},
};

async function getXMLdataFromBanks(){
  const htmlFromCbr = await rp(reqOptions);
  const banksDescriptionObjects = parseHtml(htmlFromCbr);
  const singleSiteOwners =  splitMultipleAndSingleSiteOwners(banksDescriptionObjects);
  const XMLdataFromBanks = await requestXMLs(singleSiteOwners);
  return XMLdataFromBanks; 
}

getXMLdataFromBanks().then( harvestResponses ).catch( e => console.log("ERROR!", e));
