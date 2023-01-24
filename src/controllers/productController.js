const path = require('path')
const fs = require('fs');

// bd productos
const productsJSON = path.join(__dirname,'../database/productsDB.json');
const products = JSON.parse(fs.readFileSync(productsJSON, 'utf-8'));

// bd categorias
const categoriasJSON = path.join(__dirname,'../database/categoriasDB.json');
const categorias = JSON.parse(fs.readFileSync(categoriasJSON, 'utf-8'));

// bd marcas
const marcasJSON = path.join(__dirname,'../database/marcasDB.json');
const marcas = JSON.parse(fs.readFileSync(marcasJSON, 'utf-8'));

function createProd(prodId, req) {
    // Categorias del producto
    let prodCateg = [];
    let categ = {};
    if (typeof(req.body.prod_categorias) == "string") {
        categ = {id: req.body.prod_categorias};
        prodCateg.push(categ);
    } else {
        req.body.prod_categorias.forEach(elem => {
            categ = {id: elem};
            prodCateg.push(categ);
        });
    }
    
    // Imagenes del producto
    let imgs = [];
    let imgId = 1;
    req.files.forEach(elem => {
        img = {
            id: imgId,
            img: "/img/products/" + elem.filename,
            alt: elem.originalname
        };

        imgs.push(img);
        imgId ++;
    })

    // Crear producto
    let prod = {
        id: prodId,
        nombre: req.body.prod_nombre,
        categorias: prodCateg,
        marca: req.body.prod_marca,
        precio: req.body.prod_precio,
        descripcionCorta: req.body.prod_descripcion_corta,
        descripcionLarga: req.body.prod_descripcion_larga,
        imgs: imgs,
        novedad: false,
        preferido: false,
        buscados: false
    }

    return prod;
}

const controller = {
    productDetail: (req, res) => {
        let prod = products.find(elem => elem.id == req.params.id);
        res.render('products/productDetail', {prod: prod, categorias: categorias, marcas: marcas});
    },
    productCart: (req, res) => {
        res.render('products/productCart', {categorias: categorias});
    },
    create: (req, res) => {
        res.render('products/create', {categorias: categorias, marcas: marcas});
    },
    edit: (req, res) => {
        let prod = products.find(elem => elem.id == req.params.id);
        res.render('products/edit', {categorias: categorias, marcas: marcas, prod: prod});
    },
    products: (req, res) => {
        res.render('products/products', {categorias: categorias, prods: products, marcas: marcas})
    },
    processCreate: (req, res) => {        
        let prodId = products[products.length-1].id + 1;

        let prod = createProd(prodId, req);

        // Guardar producto en la bd
        products.push(prod);
        fs.writeFileSync(productsJSON, JSON.stringify(products, null, 2));

        return res.redirect('/products/products')
    },
    processEdit: (req, res) => {
        let idProd = req.params.idProd;
        let prod = createProd(idProd, req);

        products.forEach(elem => {
            if (elem.id == idProd) {
                elem.nombre = prod.nombre;
                elem.categorias = prod.categorias;
                elem.marca = prod.marca;
                elem.precio = prod.precio;
                elem.descripcionCorta = prod.descripcionCorta;
                elem.descripcionLarga = prod.descripcionLarga;
                elem.imgs = elem.imgs.concat(prod.imgs);
            }
        })

        fs.writeFileSync(productsJSON, JSON.stringify(products, null, 2))

        return res.redirect('/products/productDetail/' + idProd)
    }
    
}

module.exports = controller;

