const router = require('express').Router();
const entradaController = require('../controllers/entrada.controller');

router.get('/getEntradas',entradaController.getEntradas);//Obtener todas las entradas de almacén
router.get('/getEntradaById/:idEntrada',entradaController.getEntradaById);//Obtener una entrada de almacén por su ID 
router.post('/addEntrada',entradaController.addEntrada);//Añadir una entrada de almacén


module.exports = router;