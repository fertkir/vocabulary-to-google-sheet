const targetWord = window.location.toString().split('/').pop().match(/\w+/g).toString();
console.log('targetWord: ' + targetWord);

$("div.examp").each(function(index) {
    $(this).append("&nbsp;<a class=\"saveLink\" href=\"javascript:void(0);\">[Save]</a>");
});

$(".saveLink").click(function() {
    const self = $(this);
    const exampleString = self.parent()
        .text()
        .replace(/\[(.*?)\]/g, "") // removing everything in brackets, including "[Save]"
        .trim();
	const stringWithMarkedWord = markTargetWord(exampleString);
  	chrome.runtime.sendMessage(stringWithMarkedWord, function(response) {
        console.log('Saving: "' + stringWithMarkedWord + '"');
        if (response.success) {
            self.remove();
        } else {
            console.error('Could not save: "' + stringWithMarkedWord + '"');
        }
  	});
});

function markTargetWord(str) {
    const word = targetWord.endsWith('y') 
	   ? targetWord.substring(0, targetWord.length - 1) 
	   : targetWord;
	return str.replace(new RegExp(word + "\\w*","ig"), "*$&*");
}