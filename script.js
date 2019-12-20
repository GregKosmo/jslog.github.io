var textarea = document.querySelector('#javascriptToRun');
var output = document.querySelector('#javascriptOutput');
var darkMode = document.querySelector('#darkModeStylesheet');
var darkModeButton = document.querySelector('#darkModeButton');
const COLOR_MODE_CACHE_KEY = 'colorMode';
const COLOR_MODE_DARK = 'dark';
const COLOR_MODE_LIGHT = 'light';
const TAB_KEY = 9;
const LEFT_BRACKET = 219;
const RIGHT_BRACKET = 221;
const LEFT_PARENTHASES = 57;
const RIGHT_PARENTHASES = 48;
const QUOTE = 222;


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

function share() {
    const urlValue = btoa(textarea.value);
    history.pushState(undefined, 'Js Log', `?e=${urlValue}`);
}

if(window.localStorage.getItem(COLOR_MODE_CACHE_KEY) === COLOR_MODE_DARK) {
    toggleDarkMode();
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

const encodedParam = new URL(window.location).searchParams.get('e');
if(encodedParam) {
    textarea.value = atob(encodedParam);
}
textarea.addEventListener('keydown', event => {
    const value = textarea.value;
    const startIndex = textarea.selectionStart;
    const endIndex = textarea.selectionEnd;

    switch(event.code) {
        case TAB_KEY:
            //Insert 4 spaces at index
            textarea.value = value.slice(0, startIndex) + '    ' + value.slice(endIndex);
            textarea.selectionStart = startIndex + 4;
            break;

        case LEFT_BRACKET:
            //Insert right bracket at ending select index
            textarea.value = value.slice(0, endIndex) + '}' + value.slice(endIndex);
            textarea.selectionStart = endIndex;
            break;

        case RIGHT_BRACKET:
            //If on right bracket, skip over
            break;

        case LEFT_PARENTHASES:
            //Insert right parenthases at ending select index
            textarea.value = value.slice(0, endIndex) + ')' + value.slice(endIndex);
            textarea.selectionStart = endIndex;
            break;

        case RIGHT_PARENTHASES:
            //If on right parenthases, skip over
            break;

        case QUOTE:
            //Insert matching quote at ending select index. Get which it is from event.key
            break;
    }
})
/**
 * TODO: 
 *  - TypeScript support
 *  - Basic features like tabbing, auto close "{", "(", """, and "'" symbols. 
 */