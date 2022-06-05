if (typeof browser === "undefined") {
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
}

chrome.storage.sync.get(["sitesSettings"], function(result) {
  const hostnameWithoutWww = location.hostname.replace(/^www\./g, '');
  const hostnameWithoutTopDomain = hostnameWithoutWww.replace(/\.[^.]+$/g, '.*');
  const settingsList = result.sitesSettings || defaultSitesSettings;
  const siteSetting = settingsList[hostnameWithoutWww] || settingsList[hostnameWithoutTopDomain];

  if (!siteSetting) {
    return;
  }

  const language = siteSetting.language;
  const targetWord = siteSetting.targetWordSource === 'url'
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

  const exampleTag = typeof siteSetting.getExampleFromSibling !== "undefined"
    ? $(siteSetting.exampleSelector).siblings(siteSetting.getExampleFromSibling)
    : $(siteSetting.exampleSelector);

  exampleTag.each(function(index) {
    $(this).append(`&nbsp;<a class="saveLink" href="javascript:void(0);">[${browser.i18n.getMessage("save")}]</a>`);
  });

  $(".saveLink").click(function() {
    const self = $(this);
    const parent = self.parent();
    const manuallyEditedInput = parent.find(".manuallyEdited").first();
    const manuallyEditedValue = manuallyEditedInput.find("textarea").first().val();
    self.nextAll().remove();
    const exampleElement = typeof excludedChildrenFromExample !== 'undefined' 
      ? parent.clone()
          .children(excludedChildrenFromExample)
          .remove()
          .end()
      : parent;
    const exampleString = exampleElement.text()
      .replace(/\[(.*?)\]/g, "") // removing everything in brackets, including "[Save]"
      .trim()
      .replace(/^"?|"?$/g, ''); // removing leading & trailing double quotes if any
    const preparedUrl = window.location.href + "#:~:text=" + encodeURIComponent(exampleString.substring(0, 50));
    let stringWithMarkedWord;
    if (manuallyEditedValue) {
      stringWithMarkedWord = manuallyEditedValue;
    } else {
      stringWithMarkedWord = markTargetWord(exampleString);
      console.log(stringWithMarkedWord);
      if (!isWordMarked(stringWithMarkedWord)) {
        parent.append("<div class=\"manuallyEdited\"><textarea>" + exampleString + "</textarea></div>");
        return;
      }
    }
    self.hide();
    console.log('Saving: "' + stringWithMarkedWord + '"');
    const saving = $(`<span>${browser.i18n.getMessage("saving")}</span>`).appendTo(parent);
    browser.runtime.sendMessage({language: language, str: stringWithMarkedWord, url: preparedUrl})
      .then(function(response) {
        manuallyEditedInput.remove();
        if (response.success) {
          saving.replaceWith(`<i style="color: green;">${browser.i18n.getMessage("saved")}</i>`);
        } else {
          self.show();
          console.error('Could not save: "' + stringWithMarkedWord + '"');
          saving.replaceWith(`<i style="color: red;">&nbsp;${browser.i18n.getMessage("couldNotSave")} (${response.message})</i>`);
        }
      });

    function markTargetWord(str) {
      const wordEndingRegex = "[^\\s.?,!:;]*";
      let regex = "";
      for (let word of targetWord.split(" ")) {
        if (language === 'en') {
          if (word !== targetWord && PRONOUNS_EN.has(word)) {
            continue;
          } else if (word.endsWith('y') || word.endsWith('e')) {
            word = word.substring(0, word.length - 1);
          }
        } else if (language === 'es') {
          if (word.length > 3) {
            word = word.substring(0, word.length - 2);
          }
        }
        regex += (regex === "" ? "" : "[\\s-]+") + word + wordEndingRegex;
      }
      return str.replace(new RegExp(regex,"ig"), "*$&*");
    }

    function isWordMarked(str) { return str.indexOf("*") != -1 }
  });
});

const PRONOUNS_EN = new Set(["sth", "sb", "something", "somebody", "someone"]);
