const controller = {
    productDetail: (req, res) => {
        res.render('products/productDetail');
    },
    productCart: (req, res) => {
        res.render('products/productCart');
    },
    newProduct: (req, res) => {
        res.render('products/newProduct');
    }
}

module.exports = controller;

