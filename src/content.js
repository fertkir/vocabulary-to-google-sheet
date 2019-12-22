const targetWord = window.location.toString()
	.split('/')
	.pop()
	.split(/[\\?#]/)
	.shift()
	.replace(/-/g, ' ');
console.log('targetWord: ' + targetWord);

$("div.examp").each(function(index) {
    $(this).append("&nbsp;<a class=\"saveLink\" href=\"javascript:void(0);\">[Save]</a>");
});

$(".saveLink").click(function() {
    const self = $(this);
    const parent = self.parent();
    const manuallyEditedInput = parent.find(".manuallyEdited").first();
    const manuallyEditedValue = manuallyEditedInput.find("textarea").first().val();
    var stringWithMarkedWord;
    if (manuallyEditedValue) {
    	stringWithMarkedWord = manuallyEditedValue;
    } else {
    	const exampleString = parent
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

    browser.runtime.sendMessage(stringWithMarkedWord).then(function(response) {
        console.log('Saving: "' + stringWithMarkedWord + '"');
        self.remove();
        manuallyEditedInput.remove();
        if (response.success) {
            parent.append("<i style=\"color: green;\">Saved</i>");
        } else {
            console.error('Could not save: "' + stringWithMarkedWord + '"');
            parent.append("<i style=\"color: red;\">Could not save to Google (see log)</i>");
        }
    });
});

function markTargetWord(str) {
    const word = targetWord.endsWith('y') 
	   ? targetWord.substring(0, targetWord.length - 1) 
	   : targetWord;
	return str.replace(new RegExp(word + "\\w*","ig"), "*$&*");
}

function isWordMarked(str) {
	return str.indexOf("*") != -1;
}