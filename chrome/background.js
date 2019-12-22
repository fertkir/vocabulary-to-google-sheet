const SPREADSHEET_ID = '1TqaBgB4ijD0PnSLE0iawa1Kkm8Fi4Cm-52wXT-nnQc4';
const SPREADSHEET_TAB_NAME = 'English';

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      addLineToSheet(request, token).then(function() {
        sendResponse({success: true});
      });
    });
    return true; // wait for response
  }
);

async function addLineToSheet(line, token) {
  let url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SPREADSHEET_TAB_NAME}:append`;
  url += `?valueInputOption=USER_ENTERED`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({values: [[ line ]]})
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}