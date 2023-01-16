const path = require('path')
const fs = require('fs');

// bd categorias
const categoriasJSON = path.join(__dirname,'../database/categoriasDB.json');
const categorias = JSON.parse(fs.readFileSync(categoriasJSON, 'utf-8'));

const controller = {
    login: (req, res) => {
        res.render('users/login', {categorias: categorias})
    },
    register: (req, res) => {
        res.render('users/register', {categorias: categorias})
    }
}


module.exports = controller;