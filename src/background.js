const CLIENT_ID = '444973037518-hcoukn406meu93cufq0afsbh98k2tanb.apps.googleusercontent.com';
const SPREADSHEET_ID = '1hpHaPeJ8QIv5yAFrRCn0p0yBs9PshJJBYYNOHP9EYhQ';
const SPREADSHEET_TAB_NAME = 'Sheet1';

let AUTH_TOKEN;

browser.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);

    authorize().then(function(token) {
      addLineToSheet(request, token).then(function() {
        sendResponse({success: true});
      });
    });

    return true; // wait for response
  }
);

function authorize() {
  const redirectURL = "http://localhost/vocabulary-add/" //browser.identity.getRedirectURL();
  const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
  let authURL = "https://accounts.google.com/o/oauth2/auth";
  authURL += `?client_id=${CLIENT_ID}`;
  authURL += `&response_type=token`;
  authURL += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
  authURL += `&scope=${encodeURIComponent(scopes.join(' '))}`;

  if (!AUTH_TOKEN) {
    var creating = browser.tabs.create({
        url: authURL
    }).then(function(tab) {
        console.log(tab);
    });
    return Promise.reject();
  } else {
    return Promise.resolve(AUTH_TOKEN);
  }


  // return browser.identity.launchWebAuthFlow({
  //   interactive: true,
  //   url: authURL
  // }).then(function(redirectURL) {
  //   return redirectURL.match(/access_token=([^&]+)&/)[1];
  // });
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

function logURL(requestDetails) {
  AUTH_TOKEN = requestDetails.url.match(/access_token=([^&]+)&/)[1];
  console.log("Token: " + AUTH_TOKEN);
  // browser.tabs.getCurrent().then(function(tabInfo) {
      // console.log(tabInfo);
    // browser.tabs.remove(tab.id);
  // });
  
}

browser.webRequest.onBeforeRequest.addListener(
  logURL,
  {urls: ["http://localhost/vocabulary-add/*"]}
);