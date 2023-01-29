const path = require('path')
const fs = require('fs');
const bcryptjs = require('bcryptjs');

//GUARDAR
const usersJSON = path.join(__dirname,'../data/usersDB.json');
let usuarios = JSON.parse(fs.readFileSync(usersJSON, 'utf-8'));

const controller = {
    login: (req, res) => {
        if (req.session.usuarioLogueado) {
            return res.redirect('/')
        }

        res.render('users/login')
    },
    register: (req, res) => {
        if (req.session.usuarioLogueado) {
            return res.redirect('/')
        }

        res.render('users/register')
    },
    createAcount: (req, res) => {
        if (req.session.usuarioLogueado) {
            return res.redirect('/')
        }

        // CHEQUEAR CAMPOS
        
        // chequear que usuario no existe
        if (!usuarios.find(elem => elem.email == req.body.email)) {
            
            // chequear que las pass coindicen
            if (req.body.contrasenia == req.body.confirmarContrasenia) {

                let usuario = {
                    nombre: req.body.nombre,
                    email: req.body.email,
                    contrasenia:  bcryptjs.hashSync(req.body.contrasenia, 10)
                }
                usuarios.push(usuario);
                usuariosJSON = JSON.stringify(usuarios, null, 2);
                fs.writeFileSync(usersJSON, usuariosJSON);
            
                res.redirect('/');
            }
        }
        // ERRORES!
       
    },
    processLogin: (req, res) => {
        if (!req.session.usuarioLogueado) {
            let usuario = usuarios.find(elem => elem.email == req.body.email && bcryptjs.compareSync(req.body.contrasenia, elem.contrasenia));
            if (usuario) {
                req.session.usuarioLogueado = usuario;

                if (req.body.recordar_usuario) {
                    console.log("Guardar cookie")
                    res.cookie('email', req.body.email, {maxAge: 600*1000});
                }
            } else {
                // MANDAR MENSAJE DE ERROR
                console.log("ALGO DIO MAAL")
            }

        }

        res.redirect('/');
    }
}


module.exports = controller;