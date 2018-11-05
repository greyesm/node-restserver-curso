const express = require('express');
const app = express();

//traer definiciones del archivo usuario.js
app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./cambiarpwd'));
app.use(require('./categoria'));
app.use(require('./producto'));

module.exports = app;