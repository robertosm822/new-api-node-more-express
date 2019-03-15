const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* === exemplo de rota simples
app.get('/', (req, res) => {
	res.send('Olá Mundo NODE');
});
*/

require('./src/controllers/authController.js')(app);
console.log("Iniciando..");
app.listen(5000);

