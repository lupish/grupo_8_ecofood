const express = require('express');
const router = express.Router();
const path = require('path');
const {check}=require("express-validator")
const validaciones=[
    check("prod_nombre").notEmpty().withMessage("El nombre del producto no debe ser vacío"),
    check("prod_categoria").notEmpty().withMessage("La categoría del producto debe ser elegida"),
    check("prod_estilosVida").notEmpty().withMessage("El estilo de vida del producto debe ser elegido"),
    check("prod_marca").notEmpty().withMessage("La marca del producto debe ser elegida"),
    check("prod_precio").notEmpty().withMessage("El precio no puede estar vacío").bail()
    .isNumeric().withMessage("El precio debe ser de tipo numérico").bail().custom((value,{req})=>(value=req.body.prod_precio<=0?false:true)).withMessage("El campo precio debe ser positivo y mayor a cero"),
    check("prod_descripcion_corta").notEmpty().withMessage("La descripción corta del producto no puede ser vacía"),
    check("prod_descripcion_larga").notEmpty().withMessage("La descripción larga del producto no puede ser vacía")
]
//MULTER
const multer = require('multer');
const multerDiskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../public/img/products"));
    },
    filename: (req, file, cb) => {
        let fileExt = path.extname(file.originalname);
        let originalName = file.originalname.slice(0, file.originalname.length - fileExt.length)

        let imageName = "prod-" + Date.now() + path.extname(file.originalname)
        cb(null, imageName);
    }
});
const uploadFile = multer({storage: multerDiskStorage});

//MIDDLEWARE
const adminPermission = require('../middlewares/adminPermission');

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
router.post('/create', adminPermission, uploadFile.array("prod_fotos"), validaciones, productController.processCreate);

//EDCION DE UN  PRODUCTO
router.get('/edit/:id', adminPermission, productController.edit);
router.put('/edit/:id', adminPermission, uploadFile.array("prod_fotos"), validaciones ,productController.processEdit);

//Soft delete de los productos
router.delete('/delete/soft/:id', adminPermission, productController.softDelete);
router.delete('/delete/hard/:id', adminPermission, productController.hardDelete);

// REACTIVAR PRODUCTO
router.patch('/activar/:id', adminPermission, productController.processActivate)

//LISTA DE PRODUCT0S
router.get('/listProducts/:idEstiloVida?', productController.listProducts);

module.exports = router;