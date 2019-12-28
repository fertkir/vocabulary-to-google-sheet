browser = {
    runtime: {
        onMessage: {
            addListener: function(callback) {
                chrome.extension.onMessage.addListener(callback);
            }
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
    }
}

function authorize() {
    return new Promise(function(resolve, reject) {
      	chrome.identity.getAuthToken({interactive: true}, resolve);
    });
}