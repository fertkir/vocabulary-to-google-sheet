console.log('targetWord: ' + targetWord);

exampleSelector.each(function(index) {
    $(this).append("&nbsp;<a class=\"saveLink\" href=\"javascript:void(0);\">[Save]</a>");
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
        	.trim();
		stringWithMarkedWord = markTargetWord(exampleString);
		console.log(stringWithMarkedWord);
		if (!isWordMarked(stringWithMarkedWord)) {
        	parent.append("<div class=\"manuallyEdited\"><textarea>" + exampleString + "</textarea></div>");
			return;
		}
    }
  	browser.runtime.sendMessage({language: language, str: stringWithMarkedWord}).then(function(response) {
        console.log('Saving: "' + stringWithMarkedWord + '"');
        self.remove();
        manuallyEditedInput.remove();
        if (response.success) {
            parent.append("<i style=\"color: green;\">Saved</i>");
        } else {
            console.error('Could not save: "' + stringWithMarkedWord + '"');
        	parent.append(`<i style="color: red;">Could not save (${response.message})</i>`);
        }
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