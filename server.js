const express = require('express');
const path = require('path');
const jsonfile = require('jsonfile');
const bodyParser = require('body-parser');
const expressHost = express()

const pathToJsonFileWithTimers = path.join(__dirname, 'timers-store.json');

expressHost.set('port', process.env.PORT || 8888);

expressHost.use('/', express.static(path.join(__dirname, 'src/public')));
expressHost.use(bodyParser.json());
expressHost.use(bodyParser.urlencoded({ extended: true }));
expressHost.use('/node/scripts/', express.static(path.join(__dirname, 'node_modules')));
expressHost.use('/node/styles/', express.static(path.join(__dirname, 'node_modules')));

expressHost.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

expressHost.get('/api/timers', (req, res) => {
    jsonfile.readFile(pathToJsonFileWithTimers, (err, timers) => {
        res.setHeader('Cache-Control', 'no-cache');
        res.json(timers);
    });
});

expressHost.post('/api/timers', (req, res) => {
    jsonfile.readFile(pathToJsonFileWithTimers, (err, timers) => {
        timers.push(req.body);
        jsonfile.writeFile(pathToJsonFileWithTimers, timers, { spaces: 4 }, () => {
            res.setHeader('Cache-Control', 'no-cache');
            res.json(timers);
        });
    });
});

expressHost.listen(expressHost.get('port'), () => {
    console.log(`Find the server at: http://localhost:${expressHost.get('port')}/`);
});