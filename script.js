function logToConsole(message) {
    var output = document.querySelector('#javascriptOutput');
    if(output.innerText !== '') {
        output.innerText += '\n';
    }
	output.innerText += message;
}

function logError(error) {
	var output = document.querySelector('#javascriptOutput');
    if(output.innerText !== '') {
        output.innerText += '\n';
    }
    output.innerHTML += `<span class="error">${error.message}\n@${error.stack}</span>`;
}

function runJavascript() {
	var output = document.querySelector('#javascriptOutput');
    while (output.firstChild) {
        output.removeChild(output.firstChild);
    }

	var textarea = document.querySelector('#javascriptToRun');
	var javascriptToRun = textarea.value;

	javascriptToRun = javascriptToRun.replace('console.log', 'logToConsole');

    var script = document.createElement('script');
    
    script.text = 'try {\n'
    script.text += javascriptToRun;
    script.text += '\n} catch(e) {\nlogError(e)\n}'

    document.body.appendChild(script);
    document.body.removeChild(script);
}