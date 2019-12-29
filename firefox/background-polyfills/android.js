if (!browser.identity) {

let AUTH_TOKEN;
let authDialogInitiatorTab;

authorize = async function() {
  authDialogInitiatorTab = await getCurrentTabId();
  if (!AUTH_TOKEN) {
    browser.tabs.create({ url: AUTH_URL });
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

}