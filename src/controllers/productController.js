const path = require('path')
const fs = require('fs');

// bd productos
const productsJSON = path.join(__dirname,'../data/productsDB.json');
const products = JSON.parse(fs.readFileSync(productsJSON, 'utf-8'));

// bd categorias
const categoriasJSON = path.join(__dirname,'../data/categoriasDB.json');
const categorias = JSON.parse(fs.readFileSync(categoriasJSON, 'utf-8')).filter(elem => !elem.delete);

// bd estilosVida
const estilosVidaJSON = path.join(__dirname,'../data/estilosVidaDB.json');
const estilosVida = JSON.parse(fs.readFileSync(estilosVidaJSON, 'utf-8')).filter(elem => !elem.delete);

// bd marcas
const marcasJSON = path.join(__dirname,'../data/marcasDB.json');
const marcas = JSON.parse(fs.readFileSync(marcasJSON, 'utf-8')).filter(elem => !elem.delete);
// validator
const {validationResult}=require("express-validator")

function createProd(prodId, req) {
    // estilosVida del producto
    let prodEstilosVida = [];
    let categ = {};
    if (typeof(req.body.prod_estilosVida) == "string") {
        categ = {id: req.body.prod_estilosVida};
        prodEstilosVida.push(categ);
    } else {
        req.body.prod_estilosVida.forEach(elem => {
            categ = {id: elem};
            prodEstilosVida.push(categ);
        });
    }
    
    // Imagenes del producto
    let imgs = [];
    let imgId = 1;
    req.files.forEach(elem => {
        img = {
            id: imgId,
            img: "/img/products/" + elem.originalname,
            alt: elem.originalname
        };

        imgs.push(img);
        imgId ++;
    })

    // Crear producto
    let prod = {
        id: prodId,
        nombre: req.body.prod_nombre,
        categoria: req.body.prod_categoria,
        estilosVida: prodEstilosVida,
        marca: req.body.prod_marca,
        precio: req.body.prod_precio,
        descripcionCorta: req.body.prod_descripcion_corta,
        descripcionLarga: req.body.prod_descripcion_larga,
        imgs: imgs,
        novedad: false,
        preferido: false,
        buscados: false,
        delete: false
    }

    return prod;
}

const controller = {
    productDetail: (req, res) => {
        let prod = products.find(elem => elem.id == req.params.id && elem.delete==false);
        
        if (prod) {
            res.render('products/productDetail', {prod: prod, estilosVida: estilosVida, marcas: marcas, estilosVida: estilosVida});
        } else {
            return res.redirect('/products/product-not-found');
        }
        
    },
    productCart: (req, res) => {
        res.render('products/productCart', {estilosVida: estilosVida});
    },
    create: (req, res) => {
        res.render('products/create', {categorias: categorias, estilosVida: estilosVida, marcas: marcas});
    },
    edit: (req, res) => {
        let prod = products.find(elem => elem.id == req.params.id);
        if (prod) {
            res.render('products/edit', {categorias: categorias, estilosVida: estilosVida, marcas: marcas, prod: prod});
        } else {
            return res.redirect('/products/product-not-found');
        }
    },
    listProducts: (req, res) => {
        if (req.params.idEstiloVida) {
            res.render('products/listProducts', {estilosVida: estilosVida, prods: products.filter(elem=>{return elem.delete==false && elem.estilosVida.some(estilo => estilo.id == req.params.idEstiloVida)}), marcas: marcas, estiloVidaFiltro: req.params.idEstiloVida})
        } else {
            res.render('products/listProducts', {estilosVida: estilosVida, prods: products.filter(elem=>{return elem.delete==false}), marcas: marcas})
        }
    },
    processCreate: (req, res) => {   
        let  errores=validationResult(req)
       if(errores.errors.length===0){
        console.log("NO Hay errores")
        let prodId = 1;
        if (products.length > 0) {
            prodId = products[products.length-1].id + 1;
        }

        let prod = createProd(prodId, req);

        // Guardar producto en la bd
        products.push(prod);
        fs.writeFileSync(productsJSON, JSON.stringify(products, null, 2));

        return res.redirect('/products/listProducts')
       }else{
        console.log("Hay errores")
        console.log(errores.errors);
        console.log(req.body)
        res.render('products/create', {categorias: categorias, estilosVida: estilosVida, marcas: marcas,errores:errores.mapped(),prod:req.body});
       }
    },
    processEdit: (req, res) => {
        let id = req.params.id;
        let prod = createProd(id, req);

        products.forEach(elem => {
            if (elem.id == id) {
                elem.nombre = prod.nombre;
                elem.categoria = prod.categoria;
                elem.estilosVida = prod.estilosVida;
                elem.marca = prod.marca;
                elem.precio = prod.precio;
                elem.descripcionCorta = prod.descripcionCorta;
                elem.descripcionLarga = prod.descripcionLarga;
                elem.imgs = elem.imgs.concat(prod.imgs);
            }
        })

        fs.writeFileSync(productsJSON, JSON.stringify(products, null, 2))

        return res.redirect('/products/productDetail/' + id)
    },
    softDelete:(req,res)=>{
        let id = req.params.id;
        products.forEach(elem => {
            if (elem.id == id) {
                elem.delete=true;
            }
        });
        fs.writeFileSync(productsJSON, JSON.stringify(products, null, 2));
        return res.redirect('/products/productDetail/' + id)
    },
    hardDelete:(req,res)=>{
        let id = req.params.id;

        let productsNotDelete=products.filter(row=>{return row.id!=id})

        fs.writeFileSync(productsJSON, JSON.stringify(productsNotDelete, null, 2));

        return res.redirect('/panels/manageProducts/')
    },
    processActivate: (req, res) => {
        let id = req.params.id;
       
        products.forEach(elem => {
            if (elem.id == id) {
                elem.delete = false;
            }
        });

        fs.writeFileSync(productsJSON, JSON.stringify(products, null, 2));

        return res.redirect('/panels/manageProducts/')
    }
    
}

module.exports = controller;