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
    const usersJSON = path.join(__dirname,'../database/usersDB.json');
    let archivoUsuario = fs.readFileSync(usersJSON, {encoding: 'utf-8'});
    let usuarios;
    if(archivoUsuario==""){
        usuarios = [];
    }else{
        usuarios = JSON.parse(archivoUsuario);
    }
    usuarios.push(usuario);
    usuariosJSON = JSON.stringify(usuarios);
    fs.writeFileSync(usersJSON, usuariosJSON);
   
    res.redirect('/');
 }
}


module.exports = controller;