const express = require('express');
const router = express.Router();
const path = require('path');
//MIDDLEWARE
const adminPermission = require('../middlewares/adminPermission');
const multerExport = require('../modulos/multer');

// VALIDACIONES
const { body } = require('express-validator');
const validarEstiloVida = [
    body("estiloVida_nombre").notEmpty().withMessage("Debe ingresar un nombre"),
    body("estiloVida_foto").custom((value, { req }) => {
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
const lifeStyleController = require('../controllers/lifeStylesController');

/*** RUTAS ***/
// borrado
router.delete('/delete/soft/:id', adminPermission, lifeStyleController.softDelete);
router.delete('/delete/hard/:id', adminPermission, lifeStyleController.hardDelete);

// reactivar
router.patch('/activar/:id', adminPermission, lifeStyleController.processActivate)

// crear
router.get('/create', adminPermission, lifeStyleController.create);
router.post('/create', adminPermission, multerExport("estiloVida_foto", 'estilosVida', 'single'), validarEstiloVida, lifeStyleController.processCreate);

// editar
router.get('/edit/:id', adminPermission, lifeStyleController.edit);
router.put('/edit/:id', adminPermission, multerExport("estiloVida_foto", 'estilosVida', 'single'), validarEstiloVida, lifeStyleController.processEdit);

module.exports = router;