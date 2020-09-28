var language;
var targetWord;

chrome.storage.sync.get(["sitesSettings"], function(result) {
    const hostnameWithoutWww = location.hostname.replace(/^www\./g, '');
    const hostnameWithoutTopDomain = hostnameWithoutWww.replace(/\.[^.]+$/g, '.*');
    const settingsList = result.sitesSettings || defaultSitesSettings;
    const siteSetting = settingsList[hostnameWithoutWww] || settingsList[hostnameWithoutTopDomain];

    if (!siteSetting) {
        return;
    }

    language = siteSetting.language;
    targetWord = siteSetting.targetWordSource === 'url'
        ? decodeURIComponent(window.location.toString()
            .split('/')
            .pop()
            .split(/[\\?#]/)
            .shift()
            .replace(/[+-]/g, ' ')
            .replace(/%20/g, ' '))
        : $(siteSetting.targetWordSelector).text();
    const excludedChildrenFromExample = siteSetting.excludedChildrenFromExample;

    console.log('targetWord: ' + targetWord);

    const exampleTag = $(siteSetting.exampleSelector);

    exampleTag.each(function(index) {
        $(this).append(`&nbsp;<a class="saveLink" href="javascript:void(0);">[${browser.i18n.getMessage("save")}]</a>`);
    });

    $(".saveLink").click(function() {
        const self = $(this);
        const parent = self.parent();
        const manuallyEditedInput = parent.find(".manuallyEdited").first();
        const manuallyEditedValue = manuallyEditedInput.find("textarea").first().val();
        let stringWithMarkedWord;
        if (manuallyEditedValue) {
            stringWithMarkedWord = manuallyEditedValue;
        } else {
            const exampleElement = typeof excludedChildrenFromExample !== 'undefined' 
                ? parent.clone()
                    .children(excludedChildrenFromExample)
                    .remove()
                    .end()
                : parent;
            const exampleString = exampleElement
                .text()
                .replace(/\[(.*?)\]/g, "") // removing everything in brackets, including "[Save]"
                .trim()
                .replace(/^"?|"?$/g, ''); // removing leading & trailing double quotes if any
            stringWithMarkedWord = markTargetWord(exampleString);
            console.log(stringWithMarkedWord);
            if (!isWordMarked(stringWithMarkedWord)) {
                parent.append("<div class=\"manuallyEdited\"><textarea>" + exampleString + "</textarea></div>");
                return;
            }
        }
        console.log('Saving: "' + stringWithMarkedWord + '"');
        const saving = $(`<span>${browser.i18n.getMessage("saving")}</span>`).replaceAll(self);
        browser.runtime.sendMessage({language: language, str: stringWithMarkedWord, url: window.location.href})
            .then(function(response) {
                manuallyEditedInput.remove();
                if (response.success) {
                    saving.replaceWith(`<i style="color: green;">${browser.i18n.getMessage("saved")}</i>`);
                } else {
                    console.error('Could not save: "' + stringWithMarkedWord + '"');
                    saving.replaceWith(`<i style="color: red;">${browser.i18n.getMessage("couldNotSave")} (${response.message})</i>`);
                }
            });
    });
});

function markTargetWord(str) {
    let word = targetWord;
    if (language === 'en') {
        word = targetWord.endsWith('y') 
            ? targetWord.substring(0, targetWord.length - 1) 
            : targetWord;
    } else if (language === 'es') {
        word = targetWord.length > 3
            ? targetWord.substring(0, targetWord.length - 2) 
            : targetWord;
    }
	return str.replace(new RegExp(word + "[^\\s.?,!:;]*","ig"), "*$&*");
}

function isWordMarked(str) {
	return str.indexOf("*") != -1;
}