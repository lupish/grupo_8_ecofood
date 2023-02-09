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

// bd marcas
const usersJSON = path.join(__dirname,'../data/usersDB.json');
const users = JSON.parse(fs.readFileSync(usersJSON, 'utf-8'));

const controller = {
    manageEcoFood: (req, res) => {
        res.render('panels/manageEcoFood')
    },
    manageProducts: (req, res) => {
        res.render('panels/manageProducts', {estilosVida: estilosVida, prods: products, marcas: marcas})
    },
    manageBrands: (req, res) => {
        res.render('panels/manageBrands', {marcas: marcas})
    },
    manageEstilosVida: (req, res) => {
        res.render('panels/manageLifeStyles', {estilosVida: estilosVida})
    },
    manageUsers: (req, res) => {
        res.render('panels/manageUsers', {users: users})

    }
}

module.exports = controller;