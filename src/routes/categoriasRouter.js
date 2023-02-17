const express = require('express');
const router = express.Router();
const path = require('path');

//MULTER
const multer = require('multer');
const multerDiskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../public/img/categorias"));
    },
    filename: (req, file, cb) => {
        let fileExt = path.extname(file.originalname);
        let originalName = file.originalname.slice(0, file.originalname.length - fileExt.length)

        let imageName = "categoria-" + originalName + "_" + Date.now() + path.extname(file.originalname)
        cb(null, imageName);
    }
});
const uploadFile = multer({storage: multerDiskStorage});

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
router.delete('/delete/soft/:id', categoriaController.softDelete);
router.delete('/delete/hard/:id', categoriaController.hardDelete);

// reactivar
router.patch('/activar/:id', categoriaController.processActivate)

// crear
router.get('/create', categoriaController.create);
router.post('/create', uploadFile.single("categoria_foto"), validarCategorias, categoriaController.processCreate);

// editar
router.get('/edit/:id', categoriaController.edit);
router.put('/edit/:id', uploadFile.single("categoria_foto"), validarCategorias, categoriaController.processEdit);

module.exports = router;