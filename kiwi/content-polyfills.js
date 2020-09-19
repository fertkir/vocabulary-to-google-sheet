browser = {
    runtime: {
        sendMessage: function(msg) {
            return new Promise(function(resolve, reject) {
                chrome.runtime.sendMessage(msg, resolve);
            });
        }
    },
    i18n: chrome.i18n
}