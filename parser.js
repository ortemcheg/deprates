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

rp(reqOptions).then(parseHtml).then( descriptions => {
  console.log('Got data about', descriptions.length, 'banks.');
  console.log('Here is bankDescription for 151-th bank', descriptions[150]);
}).catch( e => console.log(e) );

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

structure of a bankDescription object. The object condains data about a bank: its licence_id, its name and a list of its sites
{ "licence_id": 124, "name": "Kreddepbank", "sites": ["http://first.ru", "http://second.ru"] }

TODO:
-> before parsing the page test if its structure is what we expect (why? if the structure changes our parsing algorithm will break)

*/
