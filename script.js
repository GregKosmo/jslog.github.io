function logToConsole(message) {
	var output = document.querySelector('#javascriptOutput');
	output.innerText += message;
}

function runJavascript() {
	var output = document.querySelector('#javascriptOutput');
	output.innerText = '';

	var textarea = document.querySelector('#javascriptToRun');
	var javascriptToRun = textarea.value;

	javascriptToRun = javascriptToRun.replace('console.log', 'logToConsole');

	var script = document.createElement('script');
	script.text = javascriptToRun;

	document.body.appendChild(script);
	document.body.removeChild(script);
}