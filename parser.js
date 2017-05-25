//TODOs are at the bottom

//get all table rows except for the first one which contains the table's heading
const $table_rows = $('tr', 'table').slice(1, );

//bankDescriptions is an array bankDescription objects
//bankDescription object's structure is at the bottom
const bankDescriptions = $table_rows.map(function() {
  // tds[0] - licence, tds[1] - name (in A), ts[2] - URLs in hrefs of As of LIs of UL
  const tds = $(this).children().slice(1, );
  const licence_id = tds[0].textContent;
  const bankName = tds[1].textContent;
  //make a list of bank's sites, ignore social sites
  const urlsList = $('a', tds[2]).filter(function() {
    const socialSites = ['ok.ru', 'vk.com', 'facebook', 'twitter', 'youtube', 'instagram'];
    return !(socialSites.some((site) => {
      if (this.href.toLowerCase().indexOf(site) > -1) return true;
    }));
  }).map(function(){ return this.href }).toArray();

  return {
    licence_id: licence_id,
    name: bankName, sites: urlsList
  };
});

/*

structure of a bankDescription object. The object contains data about a given bank: its licence number, its name and a list of its websites
{ "licence_id": 124, "name": "Kreddepbank", "sites": ["http://first.ru", "http://second.ru"] }

TODO:
-> before parsing the page test if its structure is what we expect (why? if the structure changes our parsing algorithm breaks)

*/
