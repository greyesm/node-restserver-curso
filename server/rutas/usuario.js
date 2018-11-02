const express = require('express');
const Usuario = require('../models/usuario');

const app = express();
const bcript = require('bcrypt');
const _ = require('underscore');


app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 15;
    limite = Number(limite);

    // entre comillas estan los campos que se desea devolver al navegador
    // el { estado: true }, permite filtrar registro que sea solo true en el estado
    Usuario.find({ estado: true }, 'nombre email role estado')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });


        });
});


app.post('/usuario', function(req, res) {

    let body = req.body;

    //crear segun schema de usuario
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcript.hashSync(body.password, 10),
        role: body.role
    });


    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        //usuarioDB.password = null; //para no enviar el dato

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;
    //let body = req.body;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    // para actualizar campos, campo options { new: true }  
    //permite devolver el valor actualizado al navegador, pero la BD ya la cambio

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
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




app.delete('/usuario/:id', (req, res) => {

    let id = req.params.id;

    actbor = 1;
    //su actbor = 1, cambiar estado en lugar de eliminar
    //usar el valor que se define en postman,body (key y valor), con formato x-www-form-urlencoded
    if (actbor === 1) {
        let body = _.pick(req.body, ['nombre', 'estado']);

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
    } else {

        Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            if (usuarioEliminado === null) {
                return res.status(400).json({
                    ok: false,
                    err: { message: 'No existe usuario' }
                });
            }
            res.json({
                ok: true,
                usuario: usuarioEliminado
            });
        });
    }

});

module.exports = app;