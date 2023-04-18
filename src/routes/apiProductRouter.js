const express = require('express');
const router = express.Router();

module.exports = router;

// CONTROLLER
const productController = require('../controllers/apiProductController');

// RUTAS
router.get('/', productController.listAllProducts);
router.get('/listProductsByLifeStyle/:estiloVidaId', productController.listProductsByLifeStyle);
router.get('/:id', productController.detail);
