const path = require('path')
const fs = require('fs');

// bd productos
const productsJSON = path.join(__dirname,'../data/productsDB.json');
const products = JSON.parse(fs.readFileSync(productsJSON, 'utf-8'));

// bd estilosVida
const estilosVidaJSON = path.join(__dirname,'../data/estilosVidaDB.json');
const estilosVida = JSON.parse(fs.readFileSync(estilosVidaJSON, 'utf-8'));

// bd marcas
const marcasJSON = path.join(__dirname,'../data/marcasDB.json');
const marcas = JSON.parse(fs.readFileSync(marcasJSON, 'utf-8'));

const controller = {
    home: (req, res) => {
        let prodsNovedades = products.filter(elem => elem.novedad && elem.delete==false);
        let prodsPreferidos = products.filter(elem => elem.preferido && elem.delete==false);
        let prodsBuscados = products.filter(elem => elem.buscados && elem.delete==false);

// con esta linea agregue la propidad delete a los productos
// for (let index = 0; index < products.length; index++) {
//     const element = products[index];
//     element.delete=false;
    
// }

// fs.writeFileSync(productsJSON, JSON.stringify(products, null, 2))


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