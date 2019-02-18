function splitMultipleAndSingleSiteOwners(descriptions){
  const singleSiteOwners = descriptions.filter( bankDescription => {if (bankDescription.sites.length ===1) return bankDescription} );
  //For now we'll only fetch XMLs for banks which have only one site.
  return singleSiteOwners;
}

module.exports = splitMultipleAndSingleSiteOwners;
