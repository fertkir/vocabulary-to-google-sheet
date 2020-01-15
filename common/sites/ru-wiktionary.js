const language = "ru";

const targetWord = decodeURIComponent(window.location.toString()
	.split('/')
	.pop()
	.split(/[\\?#]/)
	.shift()
	.replace(/[+-]/g, ' ')
	.replace(/%20/g, ' '));
	
const exampleSelector = $(".example-block");

const excludedChildrenFromExample = ".example-details";