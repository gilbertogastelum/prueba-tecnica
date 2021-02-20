const router = require('express').Router();
const inventarioController = require('../controllers/inventario.controller');

router.get('/getProductos',inventarioController.getProductos);//Obtener todos los productos del inventario
router.get('/getInventario',inventarioController.geInventarioCompleto);//Obtener todos los productos del inventario
router.get('/getProductoById/:idProducto',inventarioController.getProductoById);//Obtener un producto del inventario por su id
router.post('/addProducto',inventarioController.addProducto);//Añadir un nuevo producto al inventario
router.put('/editProducto/:idProducto',inventarioController.editProducto);//Editar un producto del inventario por su ID
router.delete('/deleteProducto/:idProducto',inventarioController.deleteProducto);//Eliminar un producto del inventario por su ID

module.exports = router;