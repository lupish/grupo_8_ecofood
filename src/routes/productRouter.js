const express = require('express');
const router = express.Router();
const path = require('path');
const {check}=require("express-validator")
const validaciones=[
    check("prod_nombre").notEmpty().withMessage("El nombre del producto no debe ser nulo"),
    check("prod_categoria").notEmpty().withMessage("La categoria del Producto debe ser elegida"),
    check("prod_estilosVida").notEmpty().withMessage("El estilo de vida del Producto debe ser elegido"),
    check("prod_marca").notEmpty().withMessage("La marca del Producto debe ser elegida"),
    check("prod_precio").notEmpty().withMessage("el precio no puede estar vacio").bail()
    .isNumeric().withMessage("el precio debe ser tipo numerico").bail().custom((value,{req})=>(value=req.body.prod_precio<=0?false:true)).withMessage("el campo precio debe ser positivo y mayor a cero"),
    check("prod_descripcion_corta").notEmpty().withMessage("La descripcion corta del Producto no puede ser nula"),
    check("prod_descripcion_larga").notEmpty().withMessage("La descripcion larga del Producto no puede ser nula")
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
router.post('/create', uploadFile.array("prod_fotos"),validaciones, productController.processCreate);

//EDCION DE UN  PRODUCTO
router.get('/edit/:id', productController.edit);
router.put('/edit/:id', uploadFile.array("prod_fotos"), productController.processEdit);

//Soft delete de los productos
router.delete('/delete/soft/:id', productController.softDelete);
router.delete('/delete/hard/:id', productController.hardDelete);

// REACTIVAR PRODUCTO
router.patch('/activar/:id', productController.processActivate)

//LISTA DE PRODUCT0S
router.get('/listProducts/:idEstiloVida?', productController.listProducts);

module.exports = router;