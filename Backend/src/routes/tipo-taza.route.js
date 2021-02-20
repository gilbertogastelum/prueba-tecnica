const router = require('express').Router();
const tipoTazaController = require('../controllers/tipo-taza.controller');

router.get('/getTipos',tipoTazaController.getTiposTaza);//Obtener todos los tipos de tazas
router.get('/getTiposById/:idTipoTaza',tipoTazaController.getTipoTazaById);//Obtener un tipo de taza por su id
router.post('/addTipoTaza',tipoTazaController.addTipoTaza);//Añadir un nuevo tipo de taza
router.put('/editTipoTaza/:idTipoTaza',tipoTazaController.editTipoTaza);//Editar un tipo de taza por su ID
router.delete('/deleteTipoTaza/:idTipoTaza',tipoTazaController.deleteTipoTaza);//Eliminar un tipo de taza por su ID

module.exports = router;