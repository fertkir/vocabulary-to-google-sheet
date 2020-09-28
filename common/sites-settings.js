const defaultSitesSettings = {
	"dictionary.cambridge.org": {
		"language": "en",
		"targetWordSource": "url",
		"exampleSelector": "div.examp, li.eg"
	},
	"www.google.com": {
		"language": "en",
		"targetWordSource": "html",
		"targetWordSelector": "span[data-dobid^='hdw']",
		"exampleSelector": "div.vk_gy"
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
	},
	"www.dictionary.com": {
		"language": "en",
		"targetWordSource": "html",
		"targetWordSelector": ".entry-headword h1",
		"exampleSelector": ".luna-example"
	},
	"www.collinsdictionary.com": {
		"language": "en",
		"targetWordSource": "url",
		"exampleSelector": ".type-example"
	}
};