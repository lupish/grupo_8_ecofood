const express = require('express');
const router = express.Router();
const path = require('path');

//MULTER
const multer = require('multer');
const multerDiskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../public/img/products"));
    },
    filename: (req, file, cb) => {
        let fileExt = path.extname(file.originalname);
        let originalName = file.originalname.slice(0, file.originalname.length - fileExt.length)

        let imageName = "prod-" + originalName + "_" + Date.now() + path.extname(file.originalname)
        cb(null, imageName);
    }
});
const uploadFile = multer({storage: multerDiskStorage});

//CONTROLADOR
const productController = require('../controllers/productController');

//RUTAS

//DETALLE DE PRODUCTO
router.get('/productDetail/:id', productController.productDetail);
//CARRITO DE COMPRAS
router.get('/productCart', productController.productCart);
//CREAR UN NUEVO PRODUCTO
router.get('/create', productController.create);
router.post('/create', uploadFile.array("prod_fotos"), productController.processCreate);
//EDCION DE UN  PRODUCTO
router.get('/edit/:id', productController.edit);
router.put('/edit/:id', uploadFile.array("prod_fotos"), productController.processEdit);
//ELIMINAR UN PRODUCTO
router.get('/edit/:id', productController.edit);
router.delete()
//LISTA DE PRODUCT0S
router.get('/products', productController.products);

module.exports = router;