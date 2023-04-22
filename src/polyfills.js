const USER_AGENT = navigator.userAgent;
const IS_ANDROID = /Android/.test(USER_AGENT);
const IS_DESKTOP = !IS_ANDROID;
const IS_FIREFOX = /Firefox/.test(USER_AGENT);
const IS_CHROMIUM = !IS_FIREFOX;
const IS_CHROME = IS_CHROMIUM && navigator.userAgentData.brands.some(brand => brand.brand === 'Google Chrome');

if (IS_CHROMIUM) {
	browser = {
		identity: chrome.identity,
		i18n: chrome.i18n,
		runtime: {
			onMessage: {
				addListener: function(callback) {
					chrome.runtime.onMessage.addListener(callback);
				}
			},
			openOptionsPage: function() {
				return new Promise(function(resolve) {
					chrome.runtime.openOptionsPage(resolve);
				});
			}
		},
		storage: {
			sync: {
				get: function(keys) {
					return new Promise(function(resolve) {
						chrome.storage.sync.get(keys, resolve);
					});
				}
			}
		},
		tabs: {
			create: function(params) {
				return new Promise(function(resolve) {
					chrome.tabs.create(params, resolve);
				});
			},
			query: function(params) {
				return new Promise(function(resolve) {
					chrome.tabs.query(params, resolve);
				});
			},
			remove: function(params) {
				return new Promise(function(resolve) {
					chrome.tabs.remove(params, resolve);
				});
			},
			update: function(initiator, params) {
				return new Promise(function(resolve) {
					chrome.tabs.update(initiator, params, resolve);
				});
			}
		},
		webRequest: chrome.webRequest
	}
}