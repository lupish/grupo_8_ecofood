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
router.post('/create', uploadFile.single("estiloVida_foto"), lifeStyleController.processCreate);

// editar
router.get('/edit/:id', lifeStyleController.edit);
router.put('/edit/:id', uploadFile.single("estiloVida_foto"), lifeStyleController.processEdit);

module.exports = router;