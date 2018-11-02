const express = require('express');

const bcript = require('bcrypt');

const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const app = express();



app.post('/login', (req, res) => {

    //obter los parametros (email y pass)
    let body = req.body;

    if (body.email === '') {
        return res.status(400).json({
            ok: false,
            err: { message: 'debe indicar email' }
        });
    }
    if (body.password === '') {
        return res.status(400).json({
            ok: false,
            err: { message: 'debe indicar clave' }
        });
    }

    //buscar si exitel el email
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }


        /*      return res.status(400).json({
                 body,
                 err: { message: ' salir' }
             }); */


        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: { message: ' Usuario (o clave) incorrecto' }
            });
        }

        //evaluar la clave
        if (!bcript.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: { message: ' Clave (o usuario) incorrecto' }
            });
        }
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEMILLA, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token: token
        });


    });

});





module.exports = app;