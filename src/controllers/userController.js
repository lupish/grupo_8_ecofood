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