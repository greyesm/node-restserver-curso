//archivo de configuraciones globales

//definir puerto en que escucha el servicio
process.env.PORT = process.env.PORT || 3000


//entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//base de datos
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';

} else {
    urlDB = 'mongodb://cafe-user:gmrm8180%@ds235807.mlab.com:35807/cafe';
}

process.env.URLcafe = urlDB;