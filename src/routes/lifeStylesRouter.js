const express = require('express');
const router = express.Router();
const path = require('path');

//MULTER
const multer = require('multer');
const multerDiskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../public/img/estilosVida"));
    },
    filename: (req, file, cb) => {
        let fileExt = path.extname(file.originalname);
        let originalName = file.originalname.slice(0, file.originalname.length - fileExt.length)

        let imageName = "estiloVida-" + originalName + "_" + Date.now() + path.extname(file.originalname)
        cb(null, imageName);
    }
});
const uploadFile = multer({storage: multerDiskStorage});

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
router.delete('/delete/soft/:id', lifeStyleController.softDelete);
router.delete('/delete/hard/:id', lifeStyleController.hardDelete);

// reactivar
router.patch('/activar/:id', lifeStyleController.processActivate)

// crear
router.get('/create', lifeStyleController.create);
router.post('/create', uploadFile.single("estiloVida_foto"), validarEstiloVida, lifeStyleController.processCreate);

// editar
router.get('/edit/:id', lifeStyleController.edit);
router.put('/edit/:id', uploadFile.single("estiloVida_foto"), validarEstiloVida, lifeStyleController.processEdit);

module.exports = router;