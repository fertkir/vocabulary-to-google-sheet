const CLIENT_ID = '444973037518-hcoukn406meu93cufq0afsbh98k2tanb.apps.googleusercontent.com';
const SPREADSHEET_ID = '1TqaBgB4ijD0PnSLE0iawa1Kkm8Fi4Cm-52wXT-nnQc4';
const SPREADSHEET_TAB_NAME = 'English';

let AUTH_TOKEN;
let authDialogInitiatorTab;

browser.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);

    authorize().then(function(token) {
      addLineToSheet(request, token).then(function(response) {
      	console.log(response);
        sendResponse({success: true});
      }, function(error) {
      	console.log(error);
        sendResponse({success: false});
      });
    });

    return true; // wait for response
  }
);

async function authorize() {
  const redirectURL = "http://localhost/vocabulary-add/";
  const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
  let authURL = "https://accounts.google.com/o/oauth2/auth";
  authURL += `?client_id=${CLIENT_ID}`;
  authURL += `&response_type=token`;
  authURL += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
  authURL += `&scope=${encodeURIComponent(scopes.join(' '))}`;

  authDialogInitiatorTab = await getCurrentTabId();
  if (!AUTH_TOKEN) {
    browser.tabs.create({ url: authURL });
    waitForToken();
  }
  return Promise.resolve(AUTH_TOKEN);
}

function waitForToken() {
  if (typeof AUTH_TOKEN !== "undefined") {
    return;
  } else { 
    setTimeout(waitForToken, 250);
  }
}

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

browser.webRequest.onBeforeRequest.addListener(function(requestDetails) {
  AUTH_TOKEN = requestDetails.url.match(/access_token=([^&]+)&/)[1];
  closeCurrentTab();
}, {urls: ["http://localhost/vocabulary-add/*"]});

function closeCurrentTab() {
  getCurrentTabId().then(function(currentTabId) {
      browser.tabs.remove(currentTabId);
  });
  browser.tabs.update(authDialogInitiatorTab, {active: true});
}

async function getCurrentTabId() {
  const tabs = await browser.tabs.query({currentWindow: true, active: true});
  return tabs[0].id;
}