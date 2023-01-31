const express = require('express');
const router = express.Router();
const path = require('path');

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

/*** CONTROLADOR ***/
const brandController = require('../controllers/brandController');

/*** RUTAS ***/
// borrado
router.delete('/delete/soft/:id', brandController.softDelete);
router.delete('/delete/hard/:id', brandController.hardDelete);

// reactivar
router.patch('/activar/:id', brandController.processActivate)

// crear
router.get('/create', brandController.create);
router.post('/create', uploadFile.single("marca_foto"), brandController.processCreate);

// editar
router.get('/edit/:id', brandController.edit);
router.put('/edit/:id', uploadFile.single("marca_foto"), brandController.processEdit);


/*

//EDCION DE UN  PRODUCTO
router.get('/edit/:id', brandController.edit);
router.put('/edit/:id', uploadFile.array("brand_foto"), brandController.processEdit);

//Soft delete de los productos
router.delete('/delete/soft/:id', brandController.softDelete);
router.delete('/delete/hard/:id', brandController.hardDelete);



//LISTA DE MARCAS
router.get('/listBrands', brandController.listBrands);

*/
module.exports = router;