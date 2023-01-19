const express = require('express');
const router = express.Router();
const path = require('path');

// multer
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

const productController = require('../controllers/productController')

router.get('/productDetail/:idProd', productController.productDetail);

router.get('/productCart', productController.productCart);

router.get('/newProduct', productController.newProduct);
router.post('/newProduct', uploadFile.array("prod_fotos"), productController.processCreate);

router.get('/editProduct/:idProd', productController.editProduct);
router.put('/editProduct/:idProd', uploadFile.array("prod_fotos"), productController.processEdit);

router.get('/listProducts', productController.listProducts);

module.exports = router;