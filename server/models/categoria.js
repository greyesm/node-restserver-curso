const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');



let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        //unique: true,
        required: [true, 'falta nombre']
    },
    //este nombre de campo el que hace link con la tabla "usuarios"
    usuario: {
        //type: String,
        //estructura si se usa el tipo com objeto
        type: Schema.Types.ObjectId,
        ref: 'Usuario', //refiere a la coleccion, pero al nombre que esta en la exportacion en arch. model usuario.js
        required: [true, 'Se debe autenticar']
    }
});



//permite poner como unico datos de los campos, lo que tengan unique en
//el esquema, seran unicos retorna el mensaje de error
categoriaSchema.plugin(uniqueValidator, { message: '{VALUE} ya existe' });

module.exports = mongoose.model('Categoria', categoriaSchema);