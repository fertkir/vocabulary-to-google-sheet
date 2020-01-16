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
    i18n: chrome.i18n
}

function authorize() {
    return new Promise(function(resolve, reject) {
      	chrome.identity.getAuthToken({interactive: true}, resolve);
    });
}