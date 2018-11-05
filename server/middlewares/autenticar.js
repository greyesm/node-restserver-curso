//verificar el token

const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {

    let token = req.get('token');



    jwt.verify(token, process.env.SEMILLA, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;

        next();
    });

    /* res.json({
         token: token
     }) */

};

//verificar token de imagenes
let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEMILLA, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;

        next();
    });
}


//valida roles
let verificaADMINrole = (req, res, next) => {

    let usuario = req.usuario;



    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: { message: 'El usuario no tiene el ROL administrador' }
        });
    }

};

module.exports = { verificaToken, verificaADMINrole, verificaTokenImg };