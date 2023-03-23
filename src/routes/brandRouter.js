const express = require('express');
const router = express.Router();
const path = require('path');

//MIDDLEWARE
const adminPermission = require('../middlewares/adminPermission');

//MULTER
const multer = require('multer');
const multerDiskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../public/img/brands"));
    },
    filename: (req, file, cb) => {
        let fileExt = path.extname(file.originalname);
        let originalName = file.originalname.slice(0, file.originalname.length - fileExt.length)

        let imageName = "brand-" + originalName + "_" + Date.now() + path.extname(file.originalname)
        cb(null, imageName);
    }
});
const uploadFile = multer({storage: multerDiskStorage});

// VALIDACIONES
const { body } = require('express-validator');
const validarMarcas = [
    body("marca_nombre").notEmpty().withMessage("Debe ingresar un nombre"),
    body("marca_foto").custom((value, { req }) => {
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
const brandController = require('../controllers/brandController');

/*** RUTAS ***/
// borrado
router.delete('/delete/soft/:id', adminPermission, brandController.softDelete);
router.delete('/delete/hard/:id', adminPermission, brandController.hardDelete);

// reactivar
router.patch('/activar/:id', adminPermission, brandController.processActivate)

// crear
router.get('/create', adminPermission, brandController.create);
router.post('/create', adminPermission, uploadFile.single("marca_foto"), validarMarcas, brandController.processCreate);

// editar
router.get('/edit/:id', adminPermission, brandController.edit);
router.put('/edit/:id', adminPermission, uploadFile.single("marca_foto"), validarMarcas, brandController.processEdit);

module.exports = router;