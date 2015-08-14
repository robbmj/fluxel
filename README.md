A command line utility to simplfy creating flux applications


Install instructions:

npm install -g fluxel
npm install -g babel
npm install --save-dev gulp gulp-babel
npm install -g gulp
npm install --save-dev browserify babelify
npm i vinyl-source-stream
npm install --save-dev gulp-watch

fluxel -c app -n [NAME] && cd [FullComponNAME]

npm install
npm run build
npm start

fluxel -r [,port number: 8080]

http://localhost:8080/


TODO:

Never overwrite an existing file

Don't add components to a component that does not already exist

Check to make sure that a component of the same name does not already exist

Check to make sure that an app with the same name does not already exist

Validation of the command object

automic creates (like DB transaction all works or nothing is written)

support for alternitive templates

Check to make sure that the cwd is in a fluxel app

better feed back to the user for success messages and error messages
