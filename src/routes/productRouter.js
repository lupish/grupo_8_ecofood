const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController')

router.get('/productDetail', productController.productDetail);
router.get('/productCart', productController.productCart);
router.get('/newProduct', productController.newProduct);
router.get('/editProduct', productController.editProduct);
router.get('/listProducts', productController.listProducts);

module.exports = router;