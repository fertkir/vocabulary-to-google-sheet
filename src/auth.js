const authorize = function() {
	if (IS_CHROMIUM && IS_DESKTOP) {
		return function() {
			return new Promise(function(resolve, reject) {
				chrome.identity.getAuthToken({interactive: true}, resolve);
			});
		}
	}
	const ANDROID_REDIRECT_URL = "http://localhost/vocabulary-add/";
	const ACCESS_TOKEN_REGEX = /access_token=([^&]+)&?/;
	const AUTH_URL = function() {
		const clientId = IS_CHROMIUM 
		? '444973037518-p9nbj088l23q3uhd9jnmbbu3lnn535mo.apps.googleusercontent.com'
		: '444973037518-hcoukn406meu93cufq0afsbh98k2tanb.apps.googleusercontent.com';
		const redirectURL = IS_DESKTOP ? browser.identity.getRedirectURL() : ANDROID_REDIRECT_URL;
		const scopes = [
		"https://www.googleapis.com/auth/spreadsheets",
		"https://www.googleapis.com/auth/drive.metadata.readonly"
		];
		return "https://accounts.google.com/o/oauth2/auth"
		+ `?client_id=${clientId}`
		+ `&response_type=token`
		+ `&redirect_uri=${encodeURIComponent(redirectURL)}`
		+ `&scope=${encodeURIComponent(scopes.join(' '))}`;
	}();

	if (IS_FIREFOX && IS_DESKTOP) {
		return function() {
			return browser.identity.launchWebAuthFlow({
				interactive: true,
				url: AUTH_URL
			}).then(function(redirectURL) {
				return redirectURL.match(ACCESS_TOKEN_REGEX)[1];
			});
		}
	}

	let ACCESS_TOKEN;
	let GENERATED_AT;
	let EXPIRES_IN_MS;

  browser.webRequest.onBeforeRequest.addListener(function(requestDetails) {
    const requestDetailsUrl = requestDetails.url;
    ACCESS_TOKEN = requestDetailsUrl.match(ACCESS_TOKEN_REGEX)[1];
    EXPIRES_IN_MS = 1000 * requestDetailsUrl.match(/expires_in=([^&]+)&?/)[1];
	}, {urls: [`${ANDROID_REDIRECT_URL}*`]});

  function invokeWhenReady(timeout, readinessCondition, callback) {
    return function waitForCondition() {
      if (readinessCondition()) {
        return callback();
      }
      setTimeout(waitForCondition, timeout);
    }();
  }

  return async function() {
    if (!ACCESS_TOKEN || (Date.now() - GENERATED_AT) >= EXPIRES_IN_MS) {
      ACCESS_TOKEN = undefined;
      GENERATED_AT = Date.now();
      browser.tabs.create({ url: AUTH_URL }).then(function (tab) {
        invokeWhenReady(100, () => ACCESS_TOKEN, () => browser.tabs.remove(tab.id));
      });
    }
    return new Promise(function (resolve, reject) {
      return invokeWhenReady(250, () => ACCESS_TOKEN, () => resolve(ACCESS_TOKEN));
    });
  }
}();