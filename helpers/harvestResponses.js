function harvestResponses( respObjects ) {
  const responsesRecived = respObjects.length;
  const successfullResponses = respObjects.filter( respObj => { if(respObj.result == 'OK') return true }).length;
  console.log("=================");
  console.log('Got', responsesRecived, 'responses');
  console.log('Successful:', successfullResponses);
  console.log('Failed:', responsesRecived - successfullResponses);
  if(responsesRecived - successfullResponses) {
    console.log(respObjects.filter( respObj => { if(respObj.result == 'Failed') return true }).map( respObj => respObj.name).join(', '));
  }
}

module.exports = harvestResponses;
