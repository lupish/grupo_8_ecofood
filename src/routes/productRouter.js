const express = require('express');
const router = express.Router();

//MIDDLEWARE
const adminPermission = require('../middlewares/adminPermission');

//MODULOS
const multerExport = require('../modulos/multer')
const validar = require('../modulos/validaciones/validacionesProducto');

//CONTROLADOR
const productController = require('../controllers/productController');

//RUTAS

//DETALLE DE PRODUCTO
router.get('/productDetail/:id', productController.productDetail);

//CARRITO DE COMPRAS
router.get('/productCart', productController.productCart);
router.get('/productCartBackup', productController.productCartBackup);

//CREAR UN NUEVO PRODUCTO
router.get('/create', adminPermission, productController.create);
router.post('/create', adminPermission,multerExport("prod_fotos", 'products', 'array'), validar('prod_nombre', 'prod_categoria', 'prod_estilosVida', 'prod_marca', 'prod_precio', 'prod_descripcion_corta', 'prod_descripcion_larga', 'prod_fotos'), productController.processCreate);

//EDCION DE UN  PRODUCTO
router.get('/edit/:id', adminPermission, productController.edit);
router.put('/edit/:id', adminPermission, multerExport("prod_fotos", 'products', 'array'), validar('prod_nombre', 'prod_categoria', 'prod_estilosVida', 'prod_marca', 'prod_precio', 'prod_descripcion_corta', 'prod_descripcion_larga', 'prod_fotos'), productController.processEdit);

//Soft delete de los productos
router.delete('/delete/soft/:id', adminPermission, productController.softDelete);
router.delete('/delete/hard/:id', adminPermission, productController.hardDelete);

// REACTIVAR PRODUCTO
router.patch('/activar/:id', adminPermission, productController.processActivate)

//LISTA DE PRODUCT0S
router.get('/listProducts/:idEstiloVida?', productController.listProducts);

module.exports = router;