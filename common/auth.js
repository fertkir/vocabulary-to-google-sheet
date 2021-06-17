const authorize = function() {
	if (IS_CHROMIUM && IS_DESKTOP) {
		return function() {
			return new Promise(function(resolve, reject) {
				chrome.identity.getAuthToken({interactive: true}, resolve);
			});
		}
	}
	const ANDROID_REDIRECT_URL = "http://localhost/vocabulary-add/";
	const ACCESS_TOKEN_REGEX = /access_token=([^&]+)&/;
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

	let AUTH_TOKEN;
	let authDialogInitiatorTab;

	browser.webRequest.onBeforeRequest.addListener(function(requestDetails) {
		AUTH_TOKEN = requestDetails.url.match(ACCESS_TOKEN_REGEX)[1];
		closeCurrentTab();

		function closeCurrentTab() {
			getCurrentTabId().then(function(currentTabId) {
				browser.tabs.remove(currentTabId);
			});
			browser.tabs.update(authDialogInitiatorTab, {active: true});
		}
	}, {urls: [`${ANDROID_REDIRECT_URL}*`]});

	async function getCurrentTabId() {
		const tabs = await browser.tabs.query({currentWindow: true, active: true});
		return tabs[0].id;
	}

	return async function() {
		authDialogInitiatorTab = await getCurrentTabId();
		if (!AUTH_TOKEN) {
			browser.tabs.create({ url: AUTH_URL });
		}
		return tokenPromise();

		function tokenPromise() {
			return new Promise(function (resolve, reject) {
				(function waitForToken(){
					if (AUTH_TOKEN) return resolve(AUTH_TOKEN);
					setTimeout(waitForToken, 250);
				})();
			});
		}
	}
}();