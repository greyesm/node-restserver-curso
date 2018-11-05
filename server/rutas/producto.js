const express = require('express');

//para usar token
const { verificaToken, verificaADMINrole } = require('../middlewares/autenticar');

const app = express();

let Producto = require('../models/producto');
const _ = require('underscore');

//========== mostrar los productos
app.get('/producto', [verificaToken], (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 15;
    limite = Number(limite);

    // entre comillas estan los campos que se desea devolver al navegador
    // el { estado: true }, permite filtrar registro que sea solo true en el estado
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email role')
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            Producto.count({ disponible: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });
            });


        });
});

//=========mostrar un producto por ID=========
app.get('/producto/:id', [verificaToken], function(req, res) {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email role')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: { message: 'No existe ID' }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });

});

//==========buscar producto 
app.get('/producto/buscar/:termino', [verificaToken], (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i'); //permite buscar similar a un like
    let disponible = true;

    Producto.find({ nombre: regex, disponible })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }

            res.json({
                ok: true,
                productos
            })
        });

});



//==========crear producto
app.post('/producto', [verificaToken], function(req, res) {

    let body = req.body;

    //crear segun schema de producto
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });

});


//==========actualizar producto
app.put('/producto/:id', [verificaToken], (req, res) => {

    let id = req.params.id;
    let body = req.body;
    //let body = _.pick(req.body, ['nombre']);
    console.log(body);

    // para actualizar campos, campo options { new: true }  
    //permite devolver el valor actualizado al navegador, pero la BD ya la cambio

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'No existe ID' }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    })


});

//==========eliminar producto

app.delete('/producto/:id', [verificaToken, verificaADMINrole], (req, res) => {

    let id = req.params.id;

    console.log(id);
    actbor = 1;
    //su actbor = 0, cambiar estado en lugar de eliminar
    //usar el valor que se define en postman,body (key y valor), con formato x-www-form-urlencoded
    if (actbor === 1) {
        let body = _.pick(req.body, ['disponible']);

        // para actualizar campos, campo options { new: true }  
        //permite devolver el valor actualizado al navegador, pero la BD ya la cambio

        Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: { message: 'No existe ID' }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        })
    } else {

        Producto.findByIdAndRemove(id, (err, productoEliminado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            if (productoEliminado === null) {
                return res.status(400).json({
                    ok: false,
                    err: { message: 'No existe producto' }
                });
            }
            res.json({
                ok: true,
                producto: productoEliminado
            });
        });
    }

});


module.exports = app;