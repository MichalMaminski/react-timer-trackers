const express = require('express');
const path = require('path');
const jsonfile = require('jsonfile');
const bodyParser = require('body-parser');
const expressHost = express()

expressHost.set('port', process.env.PORT || 8888);

expressHost.use('/', express.static(path.join(__dirname, 'src/public')));
expressHost.use(bodyParser.json());
expressHost.use(bodyParser.urlencoded({ extended: true }));
expressHost.use('/node/scripts/', express.static(path.join(__dirname, 'node_modules')));
expressHost.use('/node/styles/', express.static(path.join(__dirname, 'node_modules')));

expressHost.listen(expressHost.get('port'), () => {
    console.log(`Find the server at: http://localhost:${expressHost.get('port')}/`);
});