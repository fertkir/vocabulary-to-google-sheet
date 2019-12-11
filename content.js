// content.js
// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     if( request.message === "clicked_browser_action" ) {
//       var firstHref = $("div.example").eq(0).html();

//       console.log(firstHref);

//       // This line is new!
//       chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});
//     }
//   }
// );

    const targetWord = window.location.toString().split('/').pop().match(/\w+/g).toString();
    console.log('targetWord: ' + targetWord)

    $("div.examp").each(function(index) {
  		$(this).append("&nbsp;<a class=\"saveLink\" href=\"javascript:void(0);\">[Save]</a>");
	});

   	$(".saveLink").click(function() {
		const exampleString = $(this).parent().text().replace("[Save]", "").trim();
  		console.log(markTargetWord(exampleString));
	});

	function markTargetWord(str) {
		const word = targetWord.endsWith('y') 
			? targetWord.substring(0, targetWord.length - 1) 
			: targetWord;
		return str.replace(new RegExp(word + "\\w*","g"), "*$&*");
	}