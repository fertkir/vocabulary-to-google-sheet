browser.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);
    authorize().then(function(token) {
      addLineToSheet(request.str, request.language, token).then(function() {
        sendResponse({success: true});
      }, function(error) {
        console.log(error);
        sendResponse({success: false});
      });
    });
    return true; // wait for response
  }
);

async function addLineToSheet(line, language, token) {
  const settings = await browser.storage.sync.get(['spreadsheet','enSheet','esSheet']);
  const sheets = {
    'en': settings.enSheet,
    'es': settings.esSheet
  };
  let url = `https://sheets.googleapis.com/v4/spreadsheets/${settings.spreadsheet}/values/${sheets[language]}:append`;
  url += `?valueInputOption=USER_ENTERED`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({values: [[ line ]]})
  });
  if (response.status !== 200) {
    throw new Error(response.statusText);
  }
  return response.json(); // parses JSON response into native JavaScript objects
}