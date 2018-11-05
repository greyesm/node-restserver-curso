const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//enumerar para no ingresar valor no permitido  en duro
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} El rol no existe'
};


let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'falta nombre']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'falta email']
    },
    password: {
        type: String,
        required: [true, 'falta clave']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//eliminar la propiedad solo cuando se envia como un json
//permite ocultar una propiedad
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

//permite poner como unico datos de los campos, lo que tengan unique en
//el esquema, seran unicos retorna el mensaje de error
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);