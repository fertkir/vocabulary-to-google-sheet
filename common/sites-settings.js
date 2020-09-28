const defaultSitesSettings = {
	"dictionary.cambridge.org": {
		"language": "en",
		"targetWordSource": "url",
		"exampleSelector": "div.examp, li.eg"
	},
	"google.*": {
		"language": "en",
		"targetWordSource": "html",
		"targetWordSelector": "span[data-dobid^='hdw']",
		"exampleSelector": "div.vk_gy"
	},
	"thefreedictionary.com": {
		"language": "en",
		"targetWordSource": "url",
		"exampleSelector": "span.illustration"
	},
	"macmillandictionary.com": {
		"language": "en",
		"targetWordSource": "html",
		"targetWordSelector": "h1 span.BASE",
		"exampleSelector": "div.EXAMPLES"
	},
	"merriam-webster.com": {
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
	"spanishdict.com": {
		"language": "es",
		"targetWordSource": "html",
		"targetWordSelector": "div[id^='headword-es'], div[id^='quickdef1-en']",
		"exampleSelector": "span[lang^='es']"
	},
	"dictionary.com": {
		"language": "en",
		"targetWordSource": "html",
		"targetWordSelector": ".entry-headword h1",
		"exampleSelector": ".luna-example"
	},
	"collinsdictionary.com": {
		"language": "en",
		"targetWordSource": "url",
		"exampleSelector": ".type-example"
	}
};