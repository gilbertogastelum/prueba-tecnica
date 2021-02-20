const router = require('express').Router();
const salidaController = require('../controllers/salida.controller');

router.get('/getSalidas',salidaController.getSalidas);
router.get('/getSalidaById/:idSalida',salidaController.getSalidaById);
router.post('/addSalida',salidaController.addSalida);


module.exports = router;