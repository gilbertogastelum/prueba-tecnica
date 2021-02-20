const router = require('express').Router();
const salidaController = require('../controllers/salida.controller');

router.get('/getSalidas',salidaController.getSalidas);//Obtener todas las salidas de almacén
router.get('/getSalidaById/:idSalida',salidaController.getSalidaById);//Obtener una salida de almacén por su ID 
router.post('/addSalida',salidaController.addSalida);//Añadir una salida de almacén


module.exports = router;