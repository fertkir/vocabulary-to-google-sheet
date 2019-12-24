browser = {
    runtime: {
        onMessage: {
            addListener: function(callback) {
                chrome.extension.onMessage.addListener(callback);
            }
        }
    }
}

function authorize() {
    return new Promise(function(resolve, reject) {
      	chrome.identity.getAuthToken({interactive: true}, resolve);
    });
}