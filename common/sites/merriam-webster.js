const language = "en";

const targetWord = window.location.toString()
	.split('/')
	.pop()
	.split(/[\\?#]/)
	.shift()
	.replace(/[+-]/g, ' ')
	.replace(/%20/g, ' ');
	
const exampleSelector = $(".mw_t_sp, .ex-sent");