/**
 * @type {HTMLTextAreaElement}
 */
var textarea = document.querySelector('#javascriptToRun');
/**
 * @type {HTMLPreElement}
 */
var output = document.querySelector('#javascriptOutput');
/**
 * @type {HTMLLinkElement}
 */
var darkMode = document.querySelector('#darkModeStylesheet');
/**
 * @type {HTMLInputElement}
 */
var darkModeCheckbox = document.querySelector('#darkModeCheckbox');
/**
 * @type {HTMLInputElement}
 */
var autoLogModeCheckbox = document.querySelector('#autoLogModeCheckbox');
/**
 * @type {HTMLInputElement}
 */
var booleanModeCheckbox = document.querySelector('#booleanModeCheckbox');
/**
 * @type {HTMLDivElement}
 */
var applicationMessage = document.querySelector('#applicationMessage');
/**
 * @type {HTMLTextAreaElement}
 */
var embedTextarea = document.querySelector('#embedTextarea');
/**
 * @type {HTMLIFrameElement}
 */
var embedIframe = document.querySelector('#embedIframe');
/**
 * @type {HTMLHtmlElement}
 */
var htmlInstance = document.querySelector('#html');
/**
 * @type {boolean}
 */
var autoLogMode;
/**
 * @type {boolean}
 */
var booleanMode;
/**
 * @type {boolean}
 */
var insertTextAllowed;

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

/**
 * Used to later determine how to auto-close each character
 * @type {Map<string, string>}
 */
const closingKeyMap = new Map()
    .set(LEFT_BRACKET, RIGHT_BRACKET)
    .set(LEFT_PARENTHASES, RIGHT_PARENTHASES)
    .set(LEFT_SQUARE_BRACKET, RIGHT_SQUARE_BRACKET)
    .set(SINGLE_QUOTE, SINGLE_QUOTE)
    .set(DOUBLE_QUOTE, DOUBLE_QUOTE)
    .set(BACK_TICK, BACK_TICK);

/**
 * Hides the specified dialog by id
 * @param {string} dialogId 
 */
function hideDialog(dialogId) {
    /**
     * @type {HTMLDivElement}
     */
    var dialog = document.getElementById(dialogId);

    if(dialog !== undefined) {
        dialog.classList.remove('shown');
        dialog.classList.add('hidden');
    }

    htmlInstance.classList.remove('noScroll');
}

/**
 * Shows the specified dialog by id
 * @param {string} dialogId 
 */
function showDialog(dialogId) {
    /**
     * @type {HTMLDivElement}
     */
    var dialog = document.getElementById(dialogId);

    if(dialog !== undefined) {
        dialog.classList.remove('hidden');
        dialog.classList.add('shown');
    }

    htmlInstance.classList.add('noScroll');
}

/**
 * Displays the provided message in a global toast message
 * @param {string} message 
 */
function displayApplicationMessage(message) {
    applicationMessage.innerText = message;
    applicationMessage.classList.add('shown');

    setTimeout(() => {
        applicationMessage.classList.remove('shown');
    }, 3000)
}

/**
 * Empties all logged information in virtual console
 */
function resetConsole() {
    while (output.firstChild) {
        output.removeChild(output.firstChild);
    }
}

/**
 * Adds provided message to virtual console
 * @param {string} message 
 */
function logToConsole(message) {
    if(output.innerText !== '') {
        output.innerText += '\n';
    }
	output.innerText += message;
}

/**
 * Logs the error stack trace to virtual console
 * @param {Error} error 
 */
function logError(error) {
    if(output.innerText !== '') {
        output.innerText += '\n';
    }
    output.innerHTML += `<span class="error">${error.message}\n@${error.stack}</span>`;
}

/**
 * Runs the javascript provided in the textarea and outputs the result in the virtual console
 */
function runJavascript() {
    resetConsole();

    if(textarea.value) {
        //This outer try/catch catches compile errors from the eval
        try {
            var javascriptToRun = textarea.value;
            //Replace any console logging with our own log method which outputs to the virtual console instead of the browser
            javascriptToRun = javascriptToRun.split('console.log').join('logToConsole');
            var script = document.createElement('script');
            
            //Wrap in try/catch so runtime errors can be logged
            script.text = 'try {\n';
            //Wrap in a function so variable scope is contained to each run of the function
            script.text += 'function runCode() {\n';
    
            if(autoLogMode) {
                //Autolog mode automatically logs the result of the evaluated code
                script.text += `logToConsole(${javascriptToRun})`
            } else if(booleanMode) {
                //Boolean mode automatically logs a truthy/falsy result of the evaluated code
                script.text += `logToConsole(${javascriptToRun} ? true : false)`
            } else {
                script.text += javascriptToRun;
            }
    
            script.text += '}\n';
            script.text += 'runCode()';
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

/**
 * Manages dark mode css and checkbox state
 * @param {boolean} enabled 
 */
function toggleDarkMode(enabled) {
    if(darkModeCheckbox.checked !== enabled) {
        darkModeCheckbox.checked = enabled;
    }

    darkMode.disabled = !enabled;
}

/**
 * Manages dark mode checkbox, global state, and url params
 * @param {boolean} enabled 
 */
function toggleBooleanMode(enabled) {
    if(booleanModeCheckbox.checked !== enabled) {
        booleanModeCheckbox.checked = enabled;
    }

    booleanMode = enabled;

    //Update url params so behavior is maintaned on refresh
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

/**
 * Manages auto log mode checkbox, global state, and url params
 * @param {boolean} enabled 
 */
function toggleAutoLogMode(enabled) {
    if(autoLogModeCheckbox.checked !== enabled) {
        autoLogModeCheckbox.checked = enabled;
    }

    autoLogMode = enabled;

    const params = new URLSearchParams(window.location.search);

    //Update url params so behavior is maintaned on refresh
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

/**
 * Rudimentary "share" functionality which just base64 and uri encodes the code inside the textarea.
 */
async function share() {
    const urlValue = encodeURIComponent(btoa(textarea.value));
    history.pushState(undefined, 'Js Log', `?e=${urlValue}${booleanMode ? '&boolean=true' : ''}${autoLogMode ? '&autoLog=true' : ''}`);

    try {
        //Attempt to use native share functionality for even more natural app feel. If it doesn't work, just copy to clipboard
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

/**
 * Attempt to copy the provided string to the user's clipboard
 * 
 * @param {string} string to copy to clipboard
 * @param {string} successMessage to show if clipboard copy works
 * @param {string} failMessage to show if clipboard copy doesn't work
 */
async function writeToClipboard(string, successMessage, failMessage) {
    try {
        await window.navigator.clipboard.writeText(string);
        displayApplicationMessage(successMessage);
    } catch(e) {
        displayApplicationMessage(failMessage);
    }
}

/**
 * Rudimentary "embed" functionality which just provides the user with an iframe set to the same url as a share
 * Sets embed url param so anything UI elements can be hidden
 */
function embed() {
    const urlValue = `${location.protocol}//${location.host}${location.pathname === '/' ? '' : location.pathname}?e=${encodeURIComponent(btoa(textarea.value))}${booleanMode ? '&boolean=true' : ''}${autoLogMode ? '&autoLog=true' : ''}&embed=true`;
    
    embedTextarea.value = `<iframe src=${urlValue}></iframe>`;
    embedIframe.src = urlValue;
}

/**
 * When the user clicks the "Save" button in the options dialog. Allows them to set their preferences so the page load that way next time they visit
 */
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

//Allows me to hide any UI in embed mode to simplify view
if(urlParams.get('embed')) {
    document.querySelectorAll('.hideOnEmbed').forEach(element => {
        element.classList.replace('hideOnEmbed', 'hidden');
    });
    textarea.disabled = true;
}

//Color mode defaults to light, but in the case of
//A) The user overriding that preference to load dark by default, or
//B) The user's OS being set to dark
//It will default to dark.
//If the user explicitly saved light as their preference though, it
//have to default to that.
if(window.localStorage.getItem(COLOR_MODE_CACHE_KEY) === COLOR_MODE_DARK 
    || (window.localStorage.getItem(COLOR_MODE_CACHE_KEY) !== COLOR_MODE_LIGHT 
    && (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches))) {
    toggleDarkMode(true);
}

//See if the user has specified any of the other modes to be loaded by default
if(window.localStorage.getItem(BOOLEAN_MODE_CACHE_KEY) === TRUE_VALUE || urlParams.get('boolean')) {
    toggleBooleanMode(true);
}

if(window.localStorage.getItem(AUTO_LOG_MODE_CACHE_KEY) === TRUE_VALUE || urlParams.get('autoLog')) {
    toggleAutoLogMode(true);
}

//Watches the user's OS for color theme changes. Allows the app to change the theme dynamically
//unless the user has explicity saved a color mode
window.matchMedia('(prefers-color-scheme: dark)').addListener(event => {
    if(!window.localStorage.getItem(COLOR_MODE_CACHE_KEY)) {
        toggleDarkMode(event.matches);
    }
});

//Register service worker pretty much just to get PWA install prompt on android. Not using any functionality of it
if('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js?ver=3').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

resetConsole();
//If there's code provided in the url params, go ahead and run it
const encodedParam = new URL(window.location).searchParams.get('e');
if(encodedParam) {
    textarea.value = decodeURIComponent(atob(encodedParam));
    runJavascript();
}

textarea.addEventListener('keydown', event => {
    const value = textarea.value;
    const startIndex = textarea.selectionStart;
    const endIndex = textarea.selectionEnd;

    //Lazy-load to avoid unnecessary execCommand calls later on
    if(insertTextAllowed === undefined) {
        insertTextAllowed = document.execCommand('insertText', false, '');
    }

    if(insertTextAllowed) {
        switch(event.key) {
            case LEFT_BRACKET:
            case LEFT_PARENTHASES:
            case LEFT_SQUARE_BRACKET:
            case SINGLE_QUOTE:
            case DOUBLE_QUOTE:
            case BACK_TICK:
                //Automatically close opening characters, vscode-esque
                event.preventDefault();
                textarea.selectionStart = startIndex;
                textarea.selectionEnd = startIndex;
                document.execCommand('insertText', false, event.key);
                textarea.selectionStart = endIndex + 1;
                textarea.selectionEnd = endIndex + 1;
                document.execCommand('insertText', false, closingKeyMap.get(event.key));
                textarea.selectionStart = startIndex + 1;
                textarea.selectionEnd = endIndex + 1;
                break;
    
            case TAB_KEY:
                event.preventDefault();
    
                //Auto-leave closing characters
                if([RIGHT_PARENTHASES, DOUBLE_QUOTE, SINGLE_QUOTE, BACK_TICK, RIGHT_SQUARE_BRACKET].indexOf(value.charAt(endIndex)) !== -1) {
                    textarea.selectionStart = endIndex + 1;
                    textarea.selectionEnd = endIndex + 1;
                } else {
                    if(event.shiftKey) {
                        //Remove tab vscode-esque
                        if(value.charAt(startIndex - 1) === '\t') {
                            document.execCommand('delete');
                        }
                    } else {
                        //Insert tab at index instead of leaving the input
                        document.execCommand('insertText', false, '\t');
                    }
                }
                break;
    
            case RIGHT_PARENTHASES:
            case RIGHT_SQUARE_BRACKET:
            case SINGLE_QUOTE:
            case DOUBLE_QUOTE:
            case BACK_TICK:
                //Automatically jump out of closing characters the next character already is that character
                if(startIndex === endIndex && value.charAt(endIndex) === event.key) {
                    event.preventDefault();
                    textarea.selectionStart = endIndex + 1;
                }
                break;
    
            case ENTER:
                //Automatically place functions two lines below with a tab.
                //TODO Doesn't really work if you're tabbed in more than once
                if(value.charAt(endIndex) === RIGHT_BRACKET && value.charAt(startIndex - 1) === LEFT_BRACKET) {
                    event.preventDefault();
                    document.execCommand('insertText', false , '\n\t\n');
                    textarea.selectionStart = endIndex + 2;
                    textarea.selectionEnd = endIndex + 2;
                }
                break;
        }
    }
});