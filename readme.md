# Coming from the original monolithic application?
Click [here](refactor-instructions.md) to see refactor instructions

# Setup Instructions

## Download
- Paste the following into your terminal - `git clone git@github.com:nax3t/jquery-ajax-spa.git`

## Server
- Now `cd` into `jquery-ajax-spa/server` and run `npm install`
- Start your mongo daemon `mongod` in a separate terminal tab
- Install `nodemon` globally (if you don't already have it installed) with `npm i -g nodemon`
- Run your server in its own terminal tab with `nodemon` or `node app`

## Client
- Navigate to `jquery-ajax-spa/client` in a separate terminal tab and run `npm install`
- While working in development you can run `gulp watch` from a separate tab to listen for changes and tanspile your client-side JavaScript each time you update the `/client/src/ajax.js` file
- Run your client server from `/client` with `python -m SimpleHTTPServer`
- Navigate to `localhost:8000` in your browser
