const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');


// default options
app.use(fileUpload()); //todos archivos subidos se pasa a un repositorio

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;



    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: { message: 'no se ha seleccionado un archivo' }
            });
    }

    //validar tipos 
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: { message: 'los tipos validos son ' + tiposValidos.join(', ') },
            tipo: tipo
        });

    }


    let data = req.files.archivo;

    //restringir por tipo de extesion
    let extesionesValidas = ['jpg', 'png', 'gif', 'jpeg'];

    let nombreArchivo = data.name.split('.');
    let exten = nombreArchivo[nombreArchivo.length - 1]; //obtiene la ultima posicion del arreglo

    if (extesionesValidas.indexOf(exten) < 0) {
        return res.status(400).json({
            ok: false,
            err: { message: 'la extension debe ser ' + extesionesValidas.join(', ') },
            ext: exten
        });

    }

    //cambiar nombre al archivo que se carga

    let nomArchivo = `${id}-${ new Date().getMilliseconds()  }.${exten}`


    data.mv(`uploads/${tipo}/${nomArchivo}`, (err) => {
        if (err)
            return res.status(400).json({
                ok: false,
                err
            });

        //imgen subida en este punto

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nomArchivo);
        } else {
            imagenProducto(id, res, nomArchivo);
        }



        /*  res.json({
             ok: true,
             message: 'archivo subido'
         }); */
    });

});

function borraImagen(nombreImagen, tipo) {
    //eliminar la imagen anterior de la carpeta uploads/usuarios
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
};

function imagenUsuario(id, res, nomArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraImagen(nomArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borraImagen(nomArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //llamar a funcion borrar imagen
        borraImagen(usuarioDB.img, 'usuarios');

        usuarioDB.img = nomArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nomArchivo

            });
        });

    });
}

function imagenProducto(id, res, nomArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraImagen(nomArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            borraImagen(nomArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //llamar a funcion borrar imagen
        borraImagen(productoDB.img, 'productos');

        productoDB.img = nomArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nomArchivo

            });
        });

    });
}

module.exports = app;