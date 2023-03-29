const express = require('express');
const router = express.Router();
const path = require('path');
//MIDDLEWARE
const adminPermission = require('../middlewares/adminPermission');
const multerExport = require('../modulos/multer')

// VALIDACIONES
const { body } = require('express-validator');
const validarCategorias = [
    body("categoria_nombre").notEmpty().withMessage("Debe ingresar un nombre"),
    body("categoria_foto").custom((value, { req }) => {
        if (req.file) {
            const extensions = ['.jpg', '.png', '.gif', '.webp', '.jpeg']
            let fileExt = path.extname(req.file.originalname);

            if (!extensions.includes(fileExt)) {
                throw new Error(`Las extensiones permitidas son : ${extensions.join(", ")}`)
            }
        }

        return true;
    })
];

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
router.post('/create', adminPermission, multerExport("categoria_foto", 'categorias', 'single'), validarCategorias, categoriaController.processCreate);

// editar
router.get('/edit/:id', adminPermission, categoriaController.edit);
router.put('/edit/:id', adminPermission, multerExport("categoria_foto", 'categorias', 'single'), validarCategorias, categoriaController.processEdit);

module.exports = router;