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
    },
    createAcount: (req, res) => {
       let usuario = {
           nombre: req.body.nombre,
           email: req.body.email,
           contrasenia: req.body.contrasenia,
           confirmarContrasenia: req.body.confirmarContrasenia
       }
    //GUARDAR
    let archivoUsuario = fs.readFileSync('usersDB.json', {encoding: 'utf-8'});
    let usuarios;
    if(archivoUsuario==""){
        usuarios = [];
    }else{
        usuarios = JSON.parse(archivoUsuario);
    }
    usuarios.push(usuario);
    usuariosJSON = JSON.stringify(usuarios);
    fs.writeFileSync('usersDB.json', usuariosJSON);
   
    res.redirect('/home');
 }
}


module.exports = controller;