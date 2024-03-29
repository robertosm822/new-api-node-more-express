const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./src/app/controllers/index')(app);

console.log("Iniciando..");
app.listen(5000);

