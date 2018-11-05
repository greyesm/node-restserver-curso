const express = require('express');

//para usar token
const { verificaToken, verificaADMINrole } = require('../middlewares/autenticar');

const app = express();
const _ = require('underscore');

let Categoria = require('../models/categoria');

//=========motrar todas las categorias=========
app.get('/categoria', [verificaToken], function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email role')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            Categoria.count((err, conteo) => {

                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                });
            });


        });
});

//=========mostrar una categoria por ID=========
app.get('/categoria/:id', [verificaToken], function(req, res) {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: { message: 'No existe ID' }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

//=========crear nueva categoria=========
app.post('/categoria', [verificaToken], function(req, res) {

    let body = req.body;

    //crear segun schema de categoria
    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id
    });


    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//=========actualizar categoria=========
app.put('/categoria/:id', [verificaToken], (req, res) => {

    let id = req.params.id;
    //let body = req.body;
    let body = _.pick(req.body, ['nombre']);
    console.log(body);

    // para actualizar campos, campo options { new: true }  
    //permite devolver el valor actualizado al navegador, pero la BD ya la cambio

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'No existe ID' }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })


});

//=========borrar categoria=========
//solo puede borrar un ADMIN_ROLE
app.delete('/categoria/:id', [verificaToken, verificaADMINrole], (req, res) => {

    let id = req.params.id;

    console.log(id);
    actbor = 0;
    //su actbor = 0, cambiar estado en lugar de eliminar
    //usar el valor que se define en postman,body (key y valor), con formato x-www-form-urlencoded
    if (actbor === 1) {
        let body = _.pick(req.body, ['nombre']);

        // para actualizar campos, campo options { new: true }  
        //permite devolver el valor actualizado al navegador, pero la BD ya la cambio

        Categoria.findByIdAndUpdate(id, body, { new: true }, (err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            });
        })
    } else {

        Categoria.findByIdAndRemove(id, (err, categoriaEliminado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            if (categoriaEliminado === null) {
                return res.status(400).json({
                    ok: false,
                    err: { message: 'No existe categoria' }
                });
            }
            res.json({
                ok: true,
                categoria: categoriaEliminado
            });
        });
    }

});





module.exports = app;