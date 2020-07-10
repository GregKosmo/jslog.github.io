var textarea = document.querySelector('#javascriptToRun');
var output = document.querySelector('#javascriptOutput');
var darkMode = document.querySelector('#darkModeStylesheet');
var darkModeCheckbox = document.querySelector('#darkModeCheckbox');
var autoLogModeCheckbox = document.querySelector('#autoLogModeCheckbox');
var booleanModeCheckbox = document.querySelector('#booleanModeCheckbox');
var applicationMessage = document.querySelector('#applicationMessage');
var embedTextarea = document.querySelector('#embedTextarea');
var embedIframe = document.querySelector('#embedIframe');
var htmlInstance = document.querySelector('#html');
var autoLogMode;
var booleanMode;
const urlParams = new URLSearchParams(window.location.search);
const COLOR_MODE_CACHE_KEY = 'colorMode';
const BOOLEAN_MODE_CACHE_KEY = 'booleanMode';
const AUTO_LOG_MODE_CACHE_KEY = 'autoLogMode';
const COLOR_MODE_DARK = 'dark';
const COLOR_MODE_LIGHT = 'light';
const TRUE_VALUE = 'true';
const FALSE_VALUE = 'false';
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

    if(textarea.value) {
        try {
            var javascriptToRun = textarea.value;
            javascriptToRun = javascriptToRun.split('console.log').join('logToConsole');
            var script = document.createElement('script');
            
            script.text = 'try {\n';
            script.text += 'function runTest() {\n';
    
            if(autoLogMode) {
                script.text += `logToConsole(${javascriptToRun})`
            } else if(booleanMode) {
                script.text += `logToConsole(${javascriptToRun} ? true : false)`
            } else {
                script.text += javascriptToRun;
            }
    
    
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
}

function toggleDarkMode(enabled) {
    if(darkModeCheckbox.checked !== enabled) {
        darkModeCheckbox.checked = enabled;
    }

    darkMode.disabled = !enabled;
}

function toggleBooleanMode(enabled) {
    if(booleanModeCheckbox.checked !== enabled) {
        booleanModeCheckbox.checked = enabled;
    }

    booleanMode = enabled;

    const params = new URLSearchParams(window.location.search);

    if(booleanMode) {
        params.set('boolean', 'true');
    } else {
        params.delete('boolean');
    }

    if(params.toString() === '') {
        window.history.replaceState(undefined, 'Js Log', window.location.pathname);
    } else {
        history.replaceState(undefined, 'Js Log', `?${params.toString()}`);
    }
}

function toggleAutoLogMode(enabled) {
    if(autoLogModeCheckbox.checked !== enabled) {
        autoLogModeCheckbox.checked = enabled;
    }

    autoLogMode = enabled;

    const params = new URLSearchParams(window.location.search);

    if(autoLogMode) {
        params.set('autoLog', 'true');
    } else {
        params.delete('autoLog');
    }

    if(params.toString() === '') {
        window.history.replaceState(undefined, 'Js Log', window.location.pathname);
    } else {
        history.replaceState(undefined, 'Js Log', `?${params.toString()}`);
    }
}

async function share() {
    const urlValue = encodeURIComponent(btoa(textarea.value));
    history.pushState(undefined, 'Js Log', `?e=${urlValue}${booleanMode ? '&boolean=true' : ''}${autoLogMode ? '&autoLog=true' : ''}`);

    try {
        await navigator.share({
            title: 'Js Log',
            text: 'Check out my code on Js Log!',
            url: window.location.href
        })
    } catch(error) {
        if(!(error instanceof DOMException)) {
            writeToClipboard(window.location.href, 'URL Copied to Clipboard', 'Error Sharing Code Snippet');
        }
    }
}

async function writeToClipboard(string, successMessage, failMessage) {
    try {
        await window.navigator.clipboard.writeText(string);
        displayApplicationMessage(successMessage);
    } catch(e) {
        displayApplicationMessage(failMessage);
    }
}

function embed() {
    const urlValue = `${location.protocol}//${location.host}${location.pathname === '/' ? '' : location.pathname}?e=${encodeURIComponent(btoa(textarea.value))}${booleanMode ? '&boolean=true' : ''}${autoLogMode ? '&autoLog=true' : ''}&embed=true`;
    
    embedTextarea.value = `<iframe src=${urlValue}></iframe>`;
    embedIframe.src = urlValue;
}

function saveOptions() {
    try {
        window.localStorage.setItem(COLOR_MODE_CACHE_KEY, darkModeCheckbox.checked ? COLOR_MODE_DARK : COLOR_MODE_LIGHT);
        window.localStorage.setItem(AUTO_LOG_MODE_CACHE_KEY, autoLogModeCheckbox.checked ? TRUE_VALUE : FALSE_VALUE);
        window.localStorage.setItem(BOOLEAN_MODE_CACHE_KEY, booleanModeCheckbox.checked ? TRUE_VALUE : FALSE_VALUE);
        displayApplicationMessage('Options Saved');
    } catch(error) {
        displayApplicationMessage('Error Saving Options');
    }
}

if(urlParams.get('embed')) {
    document.querySelectorAll('.hideOnEmbed').forEach(element => {
        element.classList.replace('hideOnEmbed', 'hidden');
    });
    textarea.disabled = true;
}

if(window.localStorage.getItem(COLOR_MODE_CACHE_KEY) === COLOR_MODE_DARK || (window.localStorage.getItem(COLOR_MODE_CACHE_KEY) !== COLOR_MODE_LIGHT && (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches))) {
    toggleDarkMode(true);
}

if(window.localStorage.getItem(BOOLEAN_MODE_CACHE_KEY) === TRUE_VALUE || urlParams.get('boolean')) {
    toggleBooleanMode(true);
}

if(window.localStorage.getItem(AUTO_LOG_MODE_CACHE_KEY) === TRUE_VALUE || urlParams.get('autoLog')) {
    toggleAutoLogMode(true);
}

window.matchMedia('(prefers-color-scheme: dark)').addListener(event => {
    if(!window.localStorage.getItem(COLOR_MODE_CACHE_KEY)) {
        toggleDarkMode(event.matches);
    }
});

if('serviceWorker' in navigator) {
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
    textarea.value = decodeURIComponent(atob(encodedParam));
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