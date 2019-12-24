const CLIENT_ID = '444973037518-hcoukn406meu93cufq0afsbh98k2tanb.apps.googleusercontent.com';

let AUTH_TOKEN;
let authDialogInitiatorTab;

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
  }
  return tokenPromise();
}

function tokenPromise() {
    return new Promise(function (resolve, reject) {
        (function waitForToken(){
            if (AUTH_TOKEN) return resolve(AUTH_TOKEN);
            setTimeout(waitForToken, 250);
        })();
    });
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