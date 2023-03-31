const express = require('express');
const router = express.Router();
const path = require('path');

//MIDDLEWARE
const adminPermission = require('../middlewares/adminPermission');

//MODULOS
const multerExport = require('../modulos/multer')
const validar = require('../modulos/validaciones/validacionesGenerica');

/*** CONTROLADOR ***/
const categoriaController = require('../controllers/categoriasController');

/*** RUTAS ***/
// borrado
router.delete('/delete/soft/:id', adminPermission, categoriaController.softDelete);
router.delete('/delete/hard/:id', adminPermission, categoriaController.hardDelete);

// reactivar
router.patch('/activar/:id', adminPermission, categoriaController.processActivate)

// crear
router.get('/create', adminPermission, categoriaController.create);
router.post('/create', adminPermission, multerExport("categoria_foto", 'categorias', 'single'), validar('categoria_nombre', 'categoria_foto'), categoriaController.processCreate);

// editar
router.get('/edit/:id', adminPermission, categoriaController.edit);
router.put('/edit/:id', adminPermission, multerExport("categoria_foto", 'categorias', 'single'), validar('categoria_nombre', 'categoria_foto'), categoriaController.processEdit);

module.exports = router;