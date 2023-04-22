browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
    authorize().then(function (token) {
        addLineToSheet(request.str, request.url, request.language, token).then(function () {
            sendResponse({success: true});
        }, function (error) {
            sendResponse({success: false, message: error.message});
        });
    });
    return true; // wait for response

    async function addLineToSheet(line, dictionaryUrl, language, token) {
        const settings = await getSettings();
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${settings.spreadsheet}`
            + `/values/${settings.sheets[language]}!A1:append`
            + `?valueInputOption=USER_ENTERED`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(settings.sendUrls ? {values: [[line, "", "", dictionaryUrl]]} : {values: [[line]]})
        });
        if (response.status !== 200) {
            if (typeof response.statusText === "undefined" || response.statusText === "") {
                if (response.status === 400) {
                    throw Error(browser.i18n.getMessage("checkSheetNames"));
                }
            }
            throw new Error(response.statusText);
        }
        return response.json();

        async function getSettings() {
            const settings = await browser.storage.sync.get([
                'spreadsheet', 'sendUrls', 'enSheet', 'esSheet', 'ruSheet']);
            if (!settings.spreadsheet) {
                browser.runtime.openOptionsPage();
                throw Error(browser.i18n.getMessage("setSpreadSheetId"));
            }
            return {
                spreadsheet: settings.spreadsheet,
                sheets: {
                    'en': settings.enSheet,
                    'es': settings.esSheet,
                    'ru': settings.ruSheet
                },
                sendUrls: settings.sendUrls
            }
        }
    }
});