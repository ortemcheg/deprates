//TODOs are at the bottom

const rp = require('request-promise');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

const reqOptions = {
  url: 'http://cbr.ru/credit/CO_SitesFull.asp',
  headers: {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A'},
  encoding: null,
  transform: (body) => {
    return iconv.decode(body, 'win1251');
  }
};

rp(reqOptions).then(parseHtml).then(splitMultipleAndSingleSiteOwners).then(requestXMLs).then(harvestResponses).catch( e => console.log(e) );

function harvestResponses( respObjects ) {
  const responsesRecived = respObjects.length;
  const successfullResponses = respObjects.filter( respObj => { if(respObj.result == 'OK') return true }).length;
  console.log('Got', responsesRecived, 'responses');
  console.log('Successful:', successfullResponses);
  console.log('Failed:', responsesRecived - successfullResponses);
  if(responsesRecived - successfullResponses) {
    console.log(respObjects.filter( respObj => { if(respObj.result == 'Failed') return true }).map( respObj => respObj.name).join(', '));
  }
}

function requestXMLs(bankDescriptions) {

  return Promise.all( bankDescriptions.map( bankDescription => {
    // A blueprint of an object that will be returned
    //by either resolve or reject callbac for each response
    const objForResolvedPromise = {
      licence_id: bankDescription.licence_id,
      name: bankDescription.name
    };
    //make sure the URL is valid
    let xmlURL = bankDescription['sites'][0]+'/For_CBRF/Deposits.xml';
    //console.log('Fetching', xmlURL );
    return rp( xmlURL ).then( res => {
        objForResolvedPromise.result = 'OK';
        return objForResolvedPromise },
        rej => {
          objForResolvedPromise.result = 'Failed';
          return objForResolvedPromise } );

  } ));
}

function splitMultipleAndSingleSiteOwners(descriptions){
  const singleSiteOwners = descriptions.filter( bankDescription => {if (bankDescription.sites.length ===1) return bankDescription} );
  //For now we'll only fetch XMLs for banks which have only one site.
  return singleSiteOwners;
}

function parseHtml(html) {
  const $ = cheerio.load(html);
  //get all table rows except for the first one which contains the table's heading
  const $table_rows = $('tr', 'table').slice(1);
  //bankDescriptions is an array bankDescription objects
  //bankDescription object's structure is at the bottom
  const bankDescriptions = $table_rows.map((i, table_row) => {
    // tds[0] - licence, tds[1] - name (in A), ts[2] - URLs in hrefs of As of LIs of UL
    const tds = $(table_row).children().slice(1);
    const licence_id = $(tds[0]).text();
    const bankName = $(tds[1]).text();
    //make a list of bank's sites, ignore social sites
    const urlsList = $('a', tds[2]).filter((i, anchor) => {
      const socialSites = ['ok.ru', 'vk.com', 'facebook', 'twitter', 'youtube', 'instagram', 'linkedin'];
      return !(socialSites.some((site) => {
        if ($(anchor).attr('href').toLowerCase().indexOf(site) > -1) return true;
      }));
    }).map(function(i, anchor) {
      return $(anchor).attr('href');
    }).toArray();

    return {
      licence_id: licence_id,
      name: bankName,
      sites: urlsList
    };
  }).toArray();
  return bankDescriptions;
}

/*

structure of a bankDescription object. The object contains data about a bank: its licence_id, its name and a list of its sites
{ "licence_id": 124, "name": "Kreddepbank", "sites": ["http://first.ru", "http://second.ru"] }

TODO:
-> before parsing the page test if its structure is what we expect (why? if the structure changes our parsing algorithm will break)

*/
