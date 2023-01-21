const path = require('path')
const fs = require('fs');

// bd productos
const productsJSON = path.join(__dirname,'../database/productsDB.json');
const products = JSON.parse(fs.readFileSync(productsJSON, 'utf-8'));

// bd categorias
const estilosVidaJSON = path.join(__dirname,'../database/estilosVidaDB.json');
const estilosVida = JSON.parse(fs.readFileSync(estilosVidaJSON, 'utf-8'));

// bd marcas
const marcasJSON = path.join(__dirname,'../database/marcasDB.json');
const marcas = JSON.parse(fs.readFileSync(marcasJSON, 'utf-8'));

const controller = {
    home: (req, res) => {
        let prodsNovedades = products.filter(elem => elem.novedad);
        let prodsPreferidos = products.filter(elem => elem.preferido);
        let prodsBuscados = products.filter(elem => elem.buscados);
        res.render('home', {
            prodsNovedades: prodsNovedades,
            prodsPreferidos: prodsPreferidos,
            prodsBuscados: prodsBuscados,
            estilosVida: estilosVida,
            marcas: marcas
        });
    }
}

module.exports = controller;