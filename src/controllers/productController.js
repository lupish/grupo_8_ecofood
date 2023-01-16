const path = require('path')
const fs = require('fs');

// bd productos
const productsJSON = path.join(__dirname,'../database/productsDB.json');
const products = JSON.parse(fs.readFileSync(productsJSON, 'utf-8'));

// bd categorias
const categoriasJSON = path.join(__dirname,'../database/categoriasDB.json');
const categorias = JSON.parse(fs.readFileSync(categoriasJSON, 'utf-8'));


const controller = {
    productDetail: (req, res) => {
        let prod = products.find(elem => elem.id == req.params.idProd);
        res.render('products/productDetail', {prod: prod, categorias: categorias});
    },
    productCart: (req, res) => {
        res.render('products/productCart', {categorias: categorias});
    },
    newProduct: (req, res) => {
        res.render('products/newProduct', {categorias: categorias});
    },
    editProduct: (req, res) => {
        res.render('products/editProduct', {categorias: categorias});
    },
    listProducts: (req, res) => {
        res.render('products/listProducts', {categorias: categorias})
    }
    
}

module.exports = controller;

