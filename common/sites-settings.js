const defaultSitesSettings = {
	"dictionary.cambridge.org": {
		"language": "en",
		"targetWordSource": "url",
		"exampleSelector": "div.examp, li.eg"
	},
	"www.thefreedictionary.com": {
		"language": "en",
		"targetWordSource": "url",
		"exampleSelector": "span.illustration"
	},
	"www.macmillandictionary.com": {
		"language": "en",
		"targetWordSource": "html",
		"targetWordSelector": "h1 span.BASE",
		"exampleSelector": "div.EXAMPLES"
	},
	"www.merriam-webster.com": {
		"language": "en",
		"targetWordSource": "url",
		"exampleSelector": ".ex-sent"
	},
	"ru.wiktionary.org": {
		"language": "ru",
		"targetWordSource": "url",
		"exampleSelector": ".example-block",
		"excludedChildrenFromExampleSelector": ".example-details"
	},
	"www.spanishdict.com": {
		"language": "es",
		"targetWordSource": "html",
		"targetWordSelector": "div[id^='headword-es'], div[id^='quickdef1-en']",
		"exampleSelector": "span[lang^='es']"
	}
};