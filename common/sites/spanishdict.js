const language = "es";

const isSpanishPage = $("div[id^='dictionary-']").attr("id").endsWith(language);

const targetWord = isSpanishPage
	? $("div[id^='headword']").text()
	: $("div[id^='quickdef1']").text();

const exampleSelector = isSpanishPage 
	? $("div[class^='indent'] span:not([class]):not(:has(*))")
	: $("em[class^='example']");