var textarea = document.querySelector('#javascriptToRun');
var output = document.querySelector('#javascriptOutput');
var darkMode = document.querySelector('#darkModeStylesheet');
var darkModeButton = document.querySelector('#darkModeButton');
const COLOR_MODE_CACHE_KEY = 'colorMode';
const COLOR_MODE_DARK = 'dark';
const COLOR_MODE_LIGHT = 'light';

function logToConsole(message) {
    if(output.innerText !== '') {
        output.innerText += '\n';
    }
	output.innerText += message;
}

function logError(error) {
    if(output.innerText !== '') {
        output.innerText += '\n';
    }
    output.innerHTML += `<span class="error">${error.message}\n@${error.stack}</span>`;
}

function runJavascript() {
    while (output.firstChild) {
        output.removeChild(output.firstChild);
    }

	var javascriptToRun = textarea.value;

	javascriptToRun = javascriptToRun.replace('console.log', 'logToConsole');

    var script = document.createElement('script');
    
    script.text = 'try {\n'
    script.text += javascriptToRun;
    script.text += '\n} catch(e) {\nlogError(e)\n}'

    document.body.appendChild(script);
    document.body.removeChild(script);
}

function toggleDarkMode() {
    darkMode.disabled = !darkMode.disabled;
    window.localStorage.setItem(COLOR_MODE_CACHE_KEY, darkMode.disabled ? COLOR_MODE_LIGHT : COLOR_MODE_DARK);
    
    if(darkMode.disabled) {
        darkModeButton.innerText = 'Dark Mode';
    } else {
        darkModeButton.innerText = 'Light Mode';
    }
}

if(window.localStorage.getItem(COLOR_MODE_CACHE_KEY) === COLOR_MODE_DARK) {
    toggleDarkMode();
}