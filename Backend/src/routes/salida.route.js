const router = require('express').Router();
const salidaController = require('../controllers/salida.controller');

router.get('/getSalidas',salidaController.getSalidas);
router.get('/getSalidaById/:idSalida',salidaController.getSalidaById);
router.post('/addSalida',salidaController.addSalida);
router.put('/editSalida/:idSalida',salidaController.editSalida);
router.delete('/deleteSalida/:idSalida',salidaController.deleteSalida);

module.exports = router;