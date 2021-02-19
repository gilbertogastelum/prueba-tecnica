const router = require('express').Router();
const entradaController = require('../controllers/entrada.controller');

router.get('/getEntrada',entradaController.getEntradas);
router.get('/getProductoById/:idProducto',entradaController.getEntradaById);
router.post('/addProducto',entradaController.addEntrada);
router.put('/editProducto/:idProducto',entradaController.editEntrada);
router.delete('/deleteProducto/:idProducto',entradaController.deleteEntrada);

module.exports = router;