const express = require('express');
const bodyParser = require("body-parser");
const app = express();
__path = process.cwd();
const PORT = process.env.PORT || 8000;

// Load routes properly
const server = require('./kanamboqr'); // Ensure this exports an Express router
const code = require('./pair'); // Ensure this exports an Express router

require('events').EventEmitter.defaultMaxListeners = 500;

// ✅ Place body-parser before routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Ensure these are Express Routers
if (typeof server === 'function') {
    app.use('/kanamboqr', server);
} else {
    console.error("Error: kanamboqr.js does not export a valid Express router");
}

if (typeof code === 'function') {
    app.use('/code', code);
} else {
    console.error("Error: pair.js does not export a valid Express router");
}

// Serve static HTML pages
app.use('/pair', (req, res) => res.sendFile(__path + '/pair.html'));
app.use('/', (req, res) => res.sendFile(__path + '/kanambopage.html'));

app.listen(PORT, () => {
    console.log(`
Don't Forget To Give star to my repo🌟 welcome to KANAMBOTech 🥷💓

Server running on http://localhost:` + PORT);
});

module.exports = app;
