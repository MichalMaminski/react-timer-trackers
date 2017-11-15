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

expressHost.post('/api/timer', (req, res) => {
    jsonfile.readFile(pathToJsonFileWithTimers, (err, timers) => {
        timers.push(req.body);
        jsonfile.writeFile(pathToJsonFileWithTimers, timers, { spaces: 4 }, () => {
            res.setHeader('Cache-Control', 'no-cache');
            res.json(req.body);
        });
    });
});

expressHost.post('/api/timer/start', (req, res) => {
    jsonfile.readFile(pathToJsonFileWithTimers, (err, timers) => {
        let timerIdToStart = req.body.id;
        let updatedTimer;
        timers.forEach((timer, index) => {
            if (timer.id === timerIdToStart) {
                updatedTimer = timer;
                timer.runningSince = Date.now();
            }
        });

        jsonfile.writeFile(pathToJsonFileWithTimers, timers, { spaces: 4 }, () => {
            res.setHeader('Cache-Control', 'no-cache');
            res.json(updatedTimer);
        });
    });
});

expressHost.post('/api/timer/stop', (req, res) => {
    jsonfile.readFile(pathToJsonFileWithTimers, (err, timers) => {
        let timerIdToStart = req.body.id;
        let updateTimer;
        timers.forEach((timer, index) => {
            if (timer.id === timerIdToStart) {
                updateTimer = timer;
                timer.elapsed = timer.elapsed + (Date.now() - timer.runningSince);
                timer.runningSince = null;
            }
        });

        jsonfile.writeFile(pathToJsonFileWithTimers, timers, { spaces: 4 }, () => {
            res.setHeader('Cache-Control', 'no-cache');
            res.json(updateTimer);
        });
    });
});

expressHost.delete('/api/timer', (req, res) => {
    jsonfile.readFile(pathToJsonFileWithTimers, (err, timers) => {
        let timerIdToRemove = req.body.id;
        var newTimers = timers.filter((timer) => timer.id !== timerIdToRemove );

        jsonfile.writeFile(pathToJsonFileWithTimers, newTimers, { spaces: 4 }, () => {
            res.setHeader('Cache-Control', 'no-cache');
            res.json(req.body.id);
        });
    });
});

expressHost.put('/api/timer', (req, res) => {
    let updatedTimer = {
        id: req.body.id,
        title: req.body.title,
        project: req.body.project
    };

    jsonfile.readFile(pathToJsonFileWithTimers, (err, timers) => {
        timers = timers.map((timer) => {
            if (timer.id === updatedTimer.id) {
                return Object.assign({}, timer, updatedTimer);
            } else {
                return timer;
            }
        });

        jsonfile.writeFile(pathToJsonFileWithTimers, timers, { spaces: 4 }, (err) => {
            res.setHeader('Cache-Control', 'no-cache');
            res.json(updatedTimer);
        });
    });
});

expressHost.listen(expressHost.get('port'), () => {
    console.log(`Find the server at: http://localhost:${expressHost.get('port')}/`);
});