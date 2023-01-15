const path = require('path')
const fs = require('fs');
const productsJSON = path.join(__dirname,'../database/productsDB.json');
const products = JSON.parse(fs.readFileSync(productsJSON, 'utf-8'));

const controller = {
    home: (req, res) => {
        let prodsNovedades = products.filter(elem => elem.novedad);
        let prodsPreferidos = products.filter(elem => elem.preferido);
        let prodsBuscados = products.filter(elem => elem.buscados);
        res.render('home', {
            prodsNovedades: prodsNovedades,
            prodsPreferidos: prodsPreferidos,
            prodsBuscados: prodsBuscados
        });
    }
}

module.exports = controller;