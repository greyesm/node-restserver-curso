//archivo de configuraciones globales

//definir puerto en que escucha el servicio
process.env.PORT = process.env.PORT || 3000

//=====fecha vencimineto para el token, usado en login.js======
//60 segundos * 60 minutos * 24 horas * 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
//process.env.CADUCIDAD_TOKEN = '48h';


//====seed o validad de token para firma
//esta variable se activa en el heroku para que pueda ser usada como 
//variable de entorno con la opcin de o "||"
process.env.SEMILLA = process.env.SEMILLA || 'aqui-va-el-validador_desarrollo'



//entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//base de datos
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';

} else {
    urlDB = 'mongodb://cafe-user:a123456@ds235807.mlab.com:35807/cafe';
}

//urlDB = 'mongodb://cafe-user:a123456@ds235807.mlab.com:35807/cafe';
process.env.URLcafe = urlDB;

//conectar con GOOGLE
//=========variable de entorno para autenticar con cuentas google
process.env.CLIENT_ID = process.env.CLIENT_ID || '462442262624-idssbcteag0uvdl0a4qtna58fg98654d.apps.googleusercontent.com';