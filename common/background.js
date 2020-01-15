browser.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);
    authorize().then(function(token) {
      addLineToSheet(request.str, request.url, request.language, token).then(function() {
        sendResponse({success: true});
      }, function(error) {
        sendResponse({success: false, message: error.message});
      });
    });
    return true; // wait for response
  }
);

async function addLineToSheet(line, dictionaryUrl, language, token) {
  const settings = await getSettings();
  let url = `https://sheets.googleapis.com/v4/spreadsheets/${settings.spreadsheet}/values/${settings.sheets[language]}:append`;
  url += `?valueInputOption=USER_ENTERED`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(settings.sendUrls ? {values: [[ line,"","",dictionaryUrl ]]} : {values: [[ line ]]})
  });
  if (response.status !== 200) {
    throw new Error(response.statusText);
  }
  return response.json(); // parses JSON response into native JavaScript objects
}

async function getSettings() {
  const settings = await browser.storage.sync.get(['spreadsheet','sendUrls','enSheet','esSheet','ruSheet']);
  if (!settings.spreadsheet) {
      throw Error("Please set Spreadsheet ID in extension settings");
  }
  return {
    spreadsheet: settings.spreadsheet,
    sheets: {
      'en': settings.enSheet,
      'es': settings.esSheet,
      'ru': settings.ruSheet
    },
    sendUrls: settings.sendUrls
  }
}