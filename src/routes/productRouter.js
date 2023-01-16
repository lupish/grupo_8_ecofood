const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController')

router.get('/productDetail/:idProd', productController.productDetail);
router.get('/productCart', productController.productCart);
router.get('/newProduct', productController.newProduct);
router.get('/editProduct/:idProd?', productController.editProduct);
router.get('/listProducts', productController.listProducts);

module.exports = router;