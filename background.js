const API_KEY = 'AIzaSyCtq3pyX0R8jlaMVsrYeln_YRGY8LTGsyk';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SPREADSHEET_ID = '1TqaBgB4ijD0PnSLE0iawa1Kkm8Fi4Cm-52wXT-nnQc4';
const SPREADSHEET_TAB_NAME = 'English';

function onGAPILoad() {
  gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
  });
}

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      gapi.auth.setToken({
        'access_token': token,
      });

      const body = {values: [[
        request
      ]]};

      gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: SPREADSHEET_TAB_NAME,
        valueInputOption: 'USER_ENTERED',
        resource: body
      }).then(response => {
        console.log(`${response.result.updates.updatedCells} cells appended.`)
        sendResponse({success: true});
      }, error => {
        console.error(error);
        sendResponse({success: false});
      });
    });
    return true; // wait for response
  }
);