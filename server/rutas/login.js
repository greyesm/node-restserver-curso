const express = require('express');

const bcript = require('bcrypt');

const jwt = require('jsonwebtoken');

//=== para conectar con GOOGLE
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
//==fin google

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

//===configuracion estandard de GOOGLE
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.img,
        google: true
    }

}


//=== conectar con cuentas GOOGLE

app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        };

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: { message: 'use su atenticacion normal' }
                });
            } else {
                //renovar token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEMILLA, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {
            //si el usuario es de google y se valdio, pero no esta en la BD
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err: err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEMILLA, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });

            });

        }

    });



    //console.log(req.body);
    //ver el resultado en consola
    /* res.json({
        token: googleUser
    }); */


});



module.exports = app;