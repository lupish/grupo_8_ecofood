const express = require('express');
const router = express.Router();
const path = require('path');

//MIDDLEWARE
const adminPermission = require('../middlewares/adminPermission');

//MODULOS
const multerExport = require('../modulos/multer');
const validar = require('../modulos/validaciones/validacionesGenerica');

/*** CONTROLADOR ***/
const lifeStyleController = require('../controllers/lifeStylesController');

/*** RUTAS ***/
// borrado
router.delete('/delete/soft/:id', adminPermission, lifeStyleController.softDelete);
router.delete('/delete/hard/:id', adminPermission, lifeStyleController.hardDelete);

// reactivar
router.patch('/activar/:id', adminPermission, lifeStyleController.processActivate)

// crear
router.get('/create', adminPermission, lifeStyleController.create);
router.post('/create', adminPermission, multerExport("estiloVida_foto", 'estilosVida', 'single'), validar('estiloVida_nombre', 'estiloVida_foto'), lifeStyleController.processCreate);

// editar
router.get('/edit/:id', adminPermission, lifeStyleController.edit);
router.put('/edit/:id', adminPermission, multerExport("estiloVida_foto", 'estilosVida', 'single'), validar('estiloVida_nombre', 'estiloVida_foto'), lifeStyleController.processEdit);

module.exports = router;