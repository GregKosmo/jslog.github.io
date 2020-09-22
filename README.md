# jslog.github.io
Page source for jslog.dev

jslog.dev is a lightweight, fast, mobile friendly environment to test javascript and see its output in a virtual console. It is a complete client-side PWA and can be used completely offline if desired.

The initial intent of the app was to create an extremely simple place to log to console and share the results. No more having to use the browser console, no more having to set up a complicated online testing tool just to find out it doesn't have virtual console output. This site has one job and it does that job extremely well. There are no plans to expand it beyond what it is today.

Because the app is entirely client-side, there are some limitations to its capabilities. A shared snippet simply URI and base64 encodes the code you typed. If you expect to be able to code and share your entire application within this, you will be sorely dissapointed. At a certian point, the query parameter becomes quite unwieldy. The purpose of the app is more for small code testing samples.

Since its inception there have been feature additions to make getting and sharing your console results even easier. Namely:
 - Boolean mode
 - Auto log mode
 - Embedding funcationality
 - Sharing functionality
 - Basic code completion features
 - Dark mode
 - Option saving
 
Boolean mode logs the result of your text's evaluation to true or false.

Auto log mode logs the result of your text's evaluation.

Embedding allows you to include a code snippet on your page. Retains boolean and auto log modes. Removes UI components to only show code and result.

Sharing creates a shareable link and copies it to your clipboard. On mobile it opens the native OS sharing functionality via the web share API.

Basic code completion features like auto-closing parenthases, brackes, quotes, etc help you write code quicker. Mostly in place to keep the transition between vscode and the app smoother.

Dark mode saves your eyeballs. Based on your OS's theme setting initially, you can override it via the options if you'd like.

Option saving allows you to configure the app to behave how you'd like by default. Always use auto log mode? Save the option and the app will always load in that mode.
