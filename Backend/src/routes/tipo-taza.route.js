const router = require('express').Router();
const tipoTazaController = require('../controllers/tipo-taza.controller');

router.get('/getTipos',tipoTazaController.getTiposTaza);
router.get('/getTiposById/:idTipoTaza',tipoTazaController.getTipoTazaById);
router.post('/addTipoTaza',tipoTazaController.addTipoTaza);
router.put('/editTipoTaza/:idTipoTaza',tipoTazaController.editTipoTaza);
router.delete('/deleteTipoTaza/:idTipoTaza',tipoTazaController.deleteTipoTaza);

module.exports = router;