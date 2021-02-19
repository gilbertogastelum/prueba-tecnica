const express = require ('express');
const morgan  = require ('morgan');
const dotenv  = require ('dotenv');

//INICIALIZACIONES
const app= express();
dotenv.config();

//CONFIGURACIONES
app.set('port', process.env.PORT || 3000);

//MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());

//RUTAS
app.use('/api/inventario',require('./routes/inventario.route'));

//INICIAR EL SERVIDOR
app.listen(app.get('port'), () =>{
    console.log('Servidor en puerto: ',app.get('port'));
});
