const express = require('express'); const bodyParser = require("body-parser"); const app = express(); __path = process.cwd(); let PORT = process.env.PORT || 8000;

const server = require('./kanamboqr'); const code = require('./pair');

require('events').EventEmitter.defaultMaxListeners = 500;

app.use(bodyParser.json()); app.use(bodyParser.urlencoded({ extended: true }));

if (typeof server === 'function') { app.use('/kanamboqr', server); } else { console.error("Error: kanamboqr.js does not export a valid Express router"); }

if (typeof code === 'function') { app.use('/code', code); } else { console.error("Error: pair.js does not export a valid Express router"); }

app.use('/pair', (req, res) => res.sendFile(__path + '/pair.html')); app.use('/', (req, res) => res.sendFile(__path + '/kanambopage.html'));

const serverInstance = app.listen(PORT, () => { console.log(\nDon't Forget To Give a star to my repo🌟 Welcome to KANAMBOTech 🥷💓\nServer running on http://localhost: + PORT); });

// Handle EADDRINUSE error and try another port serverInstance.on('error', (err) => { if (err.code === 'EADDRINUSE') { console.error(Port ${PORT} is already in use. Trying another port...); PORT = PORT + 1; app.listen(PORT, () => { console.log(Server running on http://localhost: + PORT); }); } else { console.error("Server error:", err); } });

module.exports = app;

                                  
