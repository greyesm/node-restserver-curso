require('./config/config');

const express = require('express');

const mongoose = require('mongoose');


const app = express();

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//traer definiciones del archivo usuario.js
app.use(require('./rutas/usuario'));

/* app.get('/usuario', (req, res) => {
    res.json('get usuario');
});
 */

//conexion a la BD

mongoose.connect(process.env.URLcafe, (err, res) => {
    if (err) throw new err;
    console.log('base de dato lista');
});

app.listen(process.env.PORT, () => {
    console.log('escuchando ', process.env.PORT);
});