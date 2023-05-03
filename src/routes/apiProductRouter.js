const express = require('express');
const router = express.Router();
const validar = require('../modulos/validaciones/validacionesProducto');
const multerExport = require('../modulos/multer')

// CONTROLLER
const productController = require('../controllers/apiProductController');

// RUTAS
router.get('/', productController.listActiveProducts);
router.get('/listProductsByLifeStyle/:estiloVidaId', productController.listProductsByLifeStyle);
router.get('/listLyfeStyles', productController.listLyfeStyles);
router.get('/listBrands', productController.listBrands);
router.get('/listCategories', productController.listCategories);
router.post('/filterProducts', productController.filterProducts);
router.get('/:id', productController.detail);


// crear
router.post(
    '/create'
    ,multerExport("prod_fotos", 'products', 'array')
    ,validar('prod_nombre', 'prod_categoria', 'prod_estilosVida', 'prod_marca', 'prod_precio', 'prod_descripcion_corta', 'prod_descripcion_larga', 'prod_fotos')
    ,productController.processCreate
);

// editar
router.put(
    '/edit/:id'
    ,multerExport("prod_fotos", 'products', 'array')
    ,validar('prod_nombre', 'prod_categoria', 'prod_estilosVida', 'prod_marca', 'prod_precio', 'prod_descripcion_corta', 'prod_descripcion_larga', 'prod_fotos')
    ,productController.processEdit
);

// borrar
router.delete('/delete/:id', productController.processDelete);

// activar
router.patch('/activate/:id', productController.processActivate);

// finalizar compra
router.post('/purchase/complete', productController.finalizarCompra);
router.get('/purchase/listSales', productController.listadoVentas)

module.exports = router;