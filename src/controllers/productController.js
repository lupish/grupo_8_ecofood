const path = require('path')
const fs = require('fs');
const productsJSON = path.join(__dirname,'../database/productsDB.json');
const products = JSON.parse(fs.readFileSync(productsJSON, 'utf-8'));


const controller = {
    productDetail: (req, res) => {
        let prod = products.find(elem => elem.id == req.params.idProd);
        res.render('products/productDetail', {prod: prod});
    },
    productCart: (req, res) => {
        res.render('products/productCart');
    },
    newProduct: (req, res) => {
        res.render('products/newProduct');
    },
    editProduct: (req, res) => {
        res.render('products/editProduct');
    },
    listProducts: (req, res) => {
        res.render('products/listProducts')
    }
    
}

module.exports = controller;

