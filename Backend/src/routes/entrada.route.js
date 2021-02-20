const router = require('express').Router();
const entradaController = require('../controllers/entrada.controller');

router.get('/getEntradas',entradaController.getEntradas);
router.get('/getEntradaById/:idEntrada',entradaController.getEntradaById);
router.post('/addEntrada',entradaController.addEntrada);


module.exports = router;