const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
​
const app = express();

app.use(express.static(`${__dirname}/public`));

app.use(cors());



app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: 'true' }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

module.exports = app;