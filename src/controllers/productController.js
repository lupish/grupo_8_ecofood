const controller = {
    productDetail: (req, res) => {
        res.render('products/productDetail');
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

