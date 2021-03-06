const express = require('express');
const fs = require('fs');
const app = express();

const path = require('path');

const { verificaTokenImg } = require('../middlewares/autenticar');

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    //let pathImg = `./uploads/${tipo}/${img}`;
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    console.log(pathImagen);
    if (fs.existsSync(pathImagen)) {

        res.sendFile(pathImagen);
    } else {

        let noPathImg = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noPathImg);
    }



});

module.exports = app;