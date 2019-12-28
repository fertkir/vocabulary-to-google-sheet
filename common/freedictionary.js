const language = "en";

const targetWord = window.location.toString()
	.split('/')
	.pop()
	.split(/[\\?#]/)
	.shift()
	.replace(/[+-]/g, ' ');
	
const exampleSelector = $("span.illustration");