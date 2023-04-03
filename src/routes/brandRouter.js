const express = require('express');
const router = express.Router();

//MIDDLEWARE
const adminPermission = require('../middlewares/adminPermission');

//MODULOS
const multerExport = require('../modulos/multer');
const validar = require('../modulos/validaciones/validacionesGenerica');

/*** CONTROLADOR ***/
const brandController = require('../controllers/brandController');

/*** RUTAS ***/
// borrado
router.delete('/delete/soft/:id', adminPermission, brandController.softDelete);
router.delete('/delete/hard/:id', adminPermission, brandController.hardDelete);

// reactivar
router.patch('/activar/:id', adminPermission, brandController.processActivate)

// crear
router.get('/create', adminPermission, brandController.create);
router.post('/create', adminPermission, multerExport("marca_foto", 'brands', 'single'), validar('marca_nombre', 'marca_foto'), brandController.processCreate);

// editar
router.get('/edit/:id', adminPermission, brandController.edit);
router.put('/edit/:id', adminPermission, multerExport("marca_foto", 'brands', 'single'), validar('marca_nombre', 'marca_foto'), brandController.processEdit);

module.exports = router;