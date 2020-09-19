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
    i18n: chrome.i18n
}

const AUTH_URL = buildAuthUrl();

function buildAuthUrl() {
  const clientId = '444973037518-p9nbj088l23q3uhd9jnmbbu3lnn535mo.apps.googleusercontent.com';
  const redirectURL = browser.identity.getRedirectURL();
  const scopes = ["https://www.googleapis.com/auth/spreadsheets"];

  let authURL = "https://accounts.google.com/o/oauth2/auth";
  authURL += `?client_id=${clientId}`;
  authURL += `&response_type=token`;
  authURL += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
  authURL += `&scope=${encodeURIComponent(scopes.join(' '))}`;

  return authURL;
}

authorize = function() {
    return browser.identity.launchWebAuthFlow({
        interactive: true,
        url: AUTH_URL
    }).then(function(redirectURL) {
        return redirectURL.match(/access_token=([^&]+)&/)[1];
    });
}