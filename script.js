var textarea = document.querySelector('#javascriptToRun');
var output = document.querySelector('#javascriptOutput');
var darkMode = document.querySelector('#darkModeStylesheet');
var darkModeCheckbox = document.querySelector('#darkModeCheckbox');
var applicationMessage = document.querySelector('#applicationMessage');
var embedTextarea = document.querySelector('#embedTextarea');
var embedIframe = document.querySelector('#embedIframe');
var htmlInstance = document.querySelector('#html');
const urlParams = new URLSearchParams(window.location.search);
const COLOR_MODE_CACHE_KEY = 'colorMode';
const COLOR_MODE_DARK = 'dark';
const COLOR_MODE_LIGHT = 'light';
const TAB_KEY = 'Tab';
const LEFT_BRACKET = '{';
const RIGHT_BRACKET = '}';
const LEFT_PARENTHASES = '(';
const RIGHT_PARENTHASES = ')';
const LEFT_SQUARE_BRACKET = '[';
const RIGHT_SQUARE_BRACKET = ']';
const SINGLE_QUOTE = "'";
const DOUBLE_QUOTE = '"';
const ENTER = 'Enter';
const BACK_TICK = '`';

function hideDialog(dialogId) {
    var dialog = document.getElementById(dialogId);

    if(dialog !== undefined) {
        dialog.classList.remove('shown');
        dialog.classList.add('hidden');
    }

    htmlInstance.classList.remove('noScroll');
}

function showDialog(dialogId) {
    var dialog = document.getElementById(dialogId);

    if(dialog !== undefined) {
        dialog.classList.remove('hidden');
        dialog.classList.add('shown');
    }

    htmlInstance.classList.add('noScroll');
}

function displayApplicationMessage(message) {
    applicationMessage.innerText = message;
    applicationMessage.classList.add('shown');

    setTimeout(() => {
        applicationMessage.classList.remove('shown');
    }, 3000)
}

function resetConsole() {
    while (output.firstChild) {
        output.removeChild(output.firstChild);
    }
}

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
    resetConsole();

    try {
        var javascriptToRun = textarea.value;
        javascriptToRun = javascriptToRun.split('console.log').join('logToConsole');
        var script = document.createElement('script');
        
        script.text = 'try {\n';
        script.text += 'function runTest() {\n';
        script.text += javascriptToRun;
        script.text += '}\n';
        script.text += 'runTest()';
        script.text += '\n} catch(e) {\nlogError(e)\n}';
    
        eval(script.text);
        resetConsole();
        document.body.appendChild(script);
        document.body.removeChild(script);
    } catch(e) {
        logError(e);
    }
}

function toggleDarkMode(enabled) {
    if(darkModeCheckbox.checked !== enabled) {
        darkModeCheckbox.checked = enabled;
    }

    darkMode.disabled = !enabled;
    window.localStorage.setItem(COLOR_MODE_CACHE_KEY, darkMode.disabled ? COLOR_MODE_LIGHT : COLOR_MODE_DARK);
}

async function share() {
    const urlValue = btoa(textarea.value);
    history.pushState(undefined, 'Js Log', `?e=${urlValue}`);

    try {
        await navigator.share({
            title: 'Js Log',
            text: 'Check out my code on Js Log!',
            url: window.location.href
        })
    } catch(error) {
        writeToClipboard(window.location.href, 'URL Copied to Clipboard', 'Error Sharing Code Snippet');
    }
}

function writeToClipboard(string, successMessage, failMessage) {
    try {
        window.navigator.clipboard.writeText(string);
        displayApplicationMessage(successMessage);
    } catch(e) {
        displayApplicationMessage(failMessage);
    }
}

function embed() {
    const urlValue = `${location.host}${location.pathname}?e=${btoa(textarea.value)}&embed=true`;
    
    embedTextarea.value = `<iframe src=${urlValue}></iframe>`;
    embedIframe.src = urlValue;
}

if(urlParams.get('embed')) {
    document.querySelectorAll('.hideOnEmbed').forEach(element => {
        element.classList.replace('hideOnEmbed', 'hidden');
    });
    textarea.disabled = true;
}

if(window.localStorage.getItem(COLOR_MODE_CACHE_KEY) === COLOR_MODE_DARK || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    toggleDarkMode(true);
}

window.matchMedia('(prefers-color-scheme: dark)').addListener(event => {
    toggleDarkMode(event.matches);
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js?ver=3').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

resetConsole();
const encodedParam = new URL(window.location).searchParams.get('e');
if(encodedParam) {
    textarea.value = atob(encodedParam);
    runJavascript();
}

textarea.addEventListener('keydown', event => {
    const value = textarea.value;
    const startIndex = textarea.selectionStart;
    const endIndex = textarea.selectionEnd;

    switch(event.key) {
        case LEFT_BRACKET:
            event.preventDefault();
            textarea.selectionStart = startIndex;
            textarea.selectionEnd = startIndex;
            document.execCommand('insertText', false, '{');
            textarea.selectionStart = endIndex + 1;
            textarea.selectionEnd = endIndex + 1;
            document.execCommand('insertText', false, '}');
            textarea.selectionStart = startIndex + 1;
            textarea.selectionEnd = endIndex + 1;
            break;

        case LEFT_PARENTHASES:
            event.preventDefault();
            textarea.selectionStart = startIndex;
            textarea.selectionEnd = startIndex;
            document.execCommand('insertText', false, '(');
            textarea.selectionStart = endIndex + 1;
            textarea.selectionEnd = endIndex + 1;
            document.execCommand('insertText', false, ')');
            textarea.selectionStart = startIndex + 1;
            textarea.selectionEnd = endIndex + 1;
            break;

        case LEFT_SQUARE_BRACKET:
            event.preventDefault();
            textarea.selectionStart = startIndex;
            textarea.selectionEnd = startIndex;
            document.execCommand('insertText', false, '[');
            textarea.selectionStart = endIndex + 1;
            textarea.selectionEnd = endIndex + 1;
            document.execCommand('insertText', false, ']');
            textarea.selectionStart = startIndex + 1;
            textarea.selectionEnd = endIndex + 1;
            break;

        case SINGLE_QUOTE:
            event.preventDefault();
            textarea.selectionStart = startIndex;
            textarea.selectionEnd = startIndex;
            document.execCommand('insertText', false, "'");
            textarea.selectionStart = endIndex + 1;
            textarea.selectionEnd = endIndex + 1;
            document.execCommand('insertText', false, "'");
            textarea.selectionStart = startIndex + 1;
            textarea.selectionEnd = endIndex + 1;
            break;

        case DOUBLE_QUOTE:
            event.preventDefault();
            textarea.selectionStart = startIndex;
            textarea.selectionEnd = startIndex;
            document.execCommand('insertText', false, '"');
            textarea.selectionStart = endIndex + 1;
            textarea.selectionEnd = endIndex + 1;
            document.execCommand('insertText', false, '"');
            textarea.selectionStart = startIndex + 1;
            textarea.selectionEnd = endIndex + 1;
            break;

        case BACK_TICK:
            event.preventDefault();
            textarea.selectionStart = startIndex;
            textarea.selectionEnd = startIndex;
            document.execCommand('insertText', false, '`');
            textarea.selectionStart = endIndex + 1;
            textarea.selectionEnd = endIndex + 1;
            document.execCommand('insertText', false, '`');
            textarea.selectionStart = startIndex + 1;
            textarea.selectionEnd = endIndex + 1;
            break;

        case TAB_KEY:
            event.preventDefault();
            //Insert tab at index
            if([RIGHT_PARENTHASES, DOUBLE_QUOTE, SINGLE_QUOTE, BACK_TICK].indexOf(value.charAt(endIndex)) !== -1) {
                textarea.selectionStart = endIndex + 1;
                textarea.selectionEnd = endIndex + 1;
            } else {
                if(event.shiftKey) {
                    if(value.charAt(startIndex - 1) === '\t') {
                        document.execCommand('delete');
                    }
                } else {
                    document.execCommand('insertText', false, '\t');
                }
            }
            break;

        case RIGHT_PARENTHASES:
            if(startIndex === endIndex && value.charAt(endIndex) === RIGHT_PARENTHASES) {
                event.preventDefault();
                textarea.selectionStart = endIndex + 1;
            }
            break;

        case RIGHT_BRACKET:
            if(startIndex === endIndex && value.charAt(endIndex) === RIGHT_BRACKET) {
                event.preventDefault();
                textarea.selectionStart = endIndex + 1;
            }
            break;

        case RIGHT_SQUARE_BRACKET:
            if(startIndex === endIndex && value.charAt(endIndex) === RIGHT_SQUARE_BRACKET) {
                event.preventDefault();
                textarea.selectionStart = endIndex + 1;
            }
            break;

        case ENTER:
            if(value.charAt(endIndex) === RIGHT_BRACKET && value.charAt(startIndex - 1) === LEFT_BRACKET) {
                event.preventDefault();
                document.execCommand('insertText', false , '\n\t\n');
                textarea.selectionStart = endIndex + 2;
                textarea.selectionEnd = endIndex + 2;
            }
            break;
    }
});
/**
 * TODO: 
 * - move light mode to options, make run farthest right button
 */