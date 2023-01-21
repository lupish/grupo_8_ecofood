const path = require('path')
const fs = require('fs');

const controller = {
    login: (req, res) => {
        res.render('users/login')
    },
    register: (req, res) => {
        res.render('users/register')
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