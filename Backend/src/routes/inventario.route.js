const router = require('express').Router();
const inventarioController = require('../controllers/inventario.controller');

router.get('/getProductos',inventarioController.getProductos);
router.get('/getProductoById/:idProducto',inventarioController.getProductoById);
router.post('/addProducto',inventarioController.addProducto);
router.put('/editProducto/:idProducto',inventarioController.editProducto);
router.delete('/deleteProducto/:idProducto',inventarioController.deleteProducto);

module.exports = router;