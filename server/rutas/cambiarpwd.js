const express = require('express');

const bcript = require('bcrypt');

const Usuario = require('../models/usuario');

const app = express();

const _ = require('underscore');


app.put('/cambiarpwd/:id', (req, res) => {

    //let body = req.body;
    let body = _.pick(req.body, ['password']);


    let id = req.params.id;

    body.password = bcript.hashSync(body.password, 10);

    // para actualizar campos, campo options { new: true }  
    //permite devolver el valor actualizado al navegador, pero la BD ya la cambio

    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })


});

module.exports = app;