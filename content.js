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
    const exampleString = parent
        .text()
        .replace(/\[(.*?)\]/g, "") // removing everything in brackets, including "[Save]"
        .trim();
	const stringWithMarkedWord = markTargetWord(exampleString);
	console.log(stringWithMarkedWord);
	if (!isWordMarked(stringWithMarkedWord)) {
        self.remove();
        parent.append("<i style=\"color: red;\">Word not found in sentence (see log)</i>");
		return;
	}
  	chrome.runtime.sendMessage(stringWithMarkedWord, function(response) {
        console.log('Saving: "' + stringWithMarkedWord + '"');
        self.remove();
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