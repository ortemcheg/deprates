const rp = require('request-promise');

function requestXMLs(bankDescriptions) {

  return Promise.all( bankDescriptions.map( bankDescription => {
    // A blueprint for an object that will be returned
    //by either resolve or reject callback for each response
    const objForResolvedPromise = {
      licence_id: bankDescription.licence_id,
      name: bankDescription.name
    };
    //make sure the URL is valid
    let xmlURL = bankDescription['sites'][0]+'/For_CBRF/Deposits.xml';
    console.log('Fetching data for', bankDescription.name);
    return rp( xmlURL ).then( res => {
        objForResolvedPromise.result = 'OK';
        return objForResolvedPromise },
        rej => {
          objForResolvedPromise.result = 'Failed';
          return objForResolvedPromise } );

  } ));
}

module.exports = requestXMLs;
