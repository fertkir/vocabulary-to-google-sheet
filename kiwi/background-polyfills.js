browser = {
    runtime: {
        onMessage: {
            addListener: function(callback) {
                chrome.extension.onMessage.addListener(callback);
            }
        },
        openOptionsPage: function() {
            return new Promise(function(resolve, reject) {
                chrome.runtime.openOptionsPage(resolve);
            });
        }
    },
    storage: {
        sync: {
            get: function(keys) {
                return new Promise(function(resolve, reject) {
                    chrome.storage.sync.get(keys, resolve);
                });
            }
        }
    },
    identity: {
            launchWebAuthFlow: function(params, url) {
                return new Promise(function(resolve, reject) {
                    chrome.identity.launchWebAuthFlow(params, resolve);
                });
            },
            getRedirectURL: chrome.identity.getRedirectURL
    },
    tabs: {
            query: function(params) {
                return new Promise(function(resolve, reject) {
                    chrome.tabs.query(params, resolve);
                });
            },
            create: function(params) {
                return new Promise(function(resolve, reject) {
                    chrome.tabs.create(params, resolve);
                });
            },
            remove: function(params) {
                return new Promise(function(resolve, reject) {
                    chrome.tabs.remove(params, resolve);
                });
            },
            update: function(initiator, params) {
                return new Promise(function(resolve, reject) {
                    chrome.tabs.update(initiator, params, resolve);
                });
            }
    },
    webRequest: chrome.webRequest,
    i18n: chrome.i18n
}

const AUTH_URL = buildAuthUrl();

function buildAuthUrl() {
  const clientId = '444973037518-p9nbj088l23q3uhd9jnmbbu3lnn535mo.apps.googleusercontent.com';
  const redirectURL = "http://localhost/vocabulary-add/";
  const scopes = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.metadata.readonly"
  ];

  let authURL = "https://accounts.google.com/o/oauth2/auth";
  authURL += `?client_id=${clientId}`;
  authURL += `&response_type=token`;
  authURL += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
  authURL += `&scope=${encodeURIComponent(scopes.join(' '))}`;

  return authURL;
}

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