const express = require('express');
const bodyParser = require('body-parser');
const absenceWebhook = require('./src/slashController');
require('./src/scheduledMessage');
const app = express();
const port = process.env.PORT || 8081;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.listen(port, () => console.log(`Absence bot listening on port ${port}!`));

app.get('/', (req, res) => res.send('Hi from absence bot'));
app.post('/absence', absenceWebhook);