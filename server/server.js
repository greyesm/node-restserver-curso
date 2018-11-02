require('./config/config');

const express = require('express');

const mongoose = require('mongoose');


const app = express();

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//poner la carpeta public como publica
const path = require('path');
app.use(express.static(path.resolve(__dirname, '../public')));


// parse application/json
app.use(bodyParser.json());

//traer definiciones de los archivos a usar como servicio
//app.use(require('./rutas/usuario'));
app.use(require('./rutas/index'));


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