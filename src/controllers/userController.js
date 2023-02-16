const path = require('path')
const fs = require('fs');
const { check, body } = require('express-validator');
const { softDelete } = require('./productController');
const { validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const { ResultWithContext } = require('express-validator/src/chain');

//bd users
const usersJSON = path.join(__dirname, '../data/usersDB.json');
let users;
if(usersJSON==""){
users = []
}else {
users = JSON.parse(fs.readFileSync(usersJSON, 'utf-8'))
}

//bd roles
const rolesJSON = path.join(__dirname, '../data/rolesDB.json');
const rol = JSON.parse(fs.readFileSync(rolesJSON, 'utf-8'));

//crar cuenta
function createAcount(userId, req){
    //imagen de usuario 
    
    let imgUser = "user-default.webp";
    let altUser = "Usuario sin imagen";
    if (req.file) {
        imgUser = req.file.filename;
        altUser = req.file.originalname;
    }
    //crear usuario
    let usuario = {
        id: userId, 
        nombre: req.body.nombre,
        email: req.body.email,
        contrasenia: bcryptjs.hashSync(req.body.contrasenia, 10),
        img: imgUser,
        alt: altUser,
        rol: rol[0].id,
        delete: false
    }
    return usuario 
  
}

//controlador
const controller = {
    login: (req, res) => {
        if (req.session.usuarioLogueado) {
            let id = req.session.usuarioLogueado.id
            return res.redirect('/users/userDetail/' + id );
        }
        res.render('users/login')
    },
    processLogin: (req, res) => {
        if (!req.session.usuarioLogueado) {
            let usuario = users.find(elem => elem.email == req.body.email && !elem.delete);   
            if (usuario) {
                console.log(req.body.contrasenia)
                if (!bcryptjs.compareSync(req.body.contrasenia, usuario.contrasenia)) {
                    let contraseniaMal = {
                        contrasenia: {
                            msg: "La contraseña no es correcta, si desea cambiarla haga clic en Olvidé mi contraseña"
                        }  
                    }
                    return res.render('users/login', { errors: contraseniaMal, oldData: req.body })
                }
                req.session.usuarioLogueado = usuario;
                if (req.body.recordar_usuario) {
                    res.cookie('email', req.body.email, {maxAge: 600*1000});                 
                }
            } else {
                let emailNoExiste = {
                    email: {
                        msg: "No existe un usuario con el mail seleccionado"
                    }  
                }
                return res.render('users/login', {errors: emailNoExiste, oldData: req.body })
            }
        }

        res.redirect('/');
    },
    register: (req, res) => {
        if (req.session.usuarioLogueado) {
            return res.redirect('/')
        }
        res.render('users/register')
    },
    processCreate: (req, res) => {
        const valRes = validationResult(req)
        if (valRes.errors.length > 0) {
            return res.render('users/register', { errors: valRes.mapped(), oldData: req.body })
        }
       // CHEQUEAR CAMPOS
       console.log(users.find(elem => elem.email == req.body.email))
        // chequear que usuario no existe
        if (!users.find(elem => elem.email == req.body.email)) {
            // chequear que las pass coindicen
            if (req.body.contrasenia == req.body.confirmarContrasenia) {
                let userId = 1;
                if (users.length > 0) {
                    userId = users[users.length-1].id + 1;
                }
                let usuario = createAcount(userId, req)
                users.push(usuario);
                usuariosJSON = JSON.stringify(users, null, 2);
                fs.writeFileSync(usersJSON, usuariosJSON);
                res.redirect('/');
            } else {
                let contraseniaDistinta = {
                    contrasenia: {
                        msg: "La contraseña ingresada no coincide con la confirmación de la misma"
                    }  
                }
                return res.render('users/register', {errors: contraseniaDistinta, oldData: req.body})
            }
        } else {
            let mailRepetido = {
                email: {
                    msg: "Ya existe un usuario con el mail ingresado"
                }  
            }
            return res.render('users/register', {errors: mailRepetido, oldData: req.body })
        }
    },
    userDetail: (req, res) => {
        let user = users.find(elem => elem.id == req.params.id && elem.delete==false);
        if (user){
            res.render('users/userDetail', {user: user, rol: rol})
        }else{
            return res.redirect('/products/product-not-found');
        }
    },
    edit: (req, res)=>{
        let user = users.find(elem=>elem.id==req.params.id);
        if (user){
            res.render('users/edit', {user: user, rol: rol})
        }else{
            return res.redirect('/products/product-not-found');
        }
    },
     processEdit: (req, res)=>{
        let userId = req.params.id; 
        function acount(userId, req){ 
        let imgUser = "user-default.webp";
        let altUser = "Usuario sin imagen";
        if (req.file) {
        imgUser = req.file.filename;
        altUser = req.file.originalname;
        } 
            let usuario = {
                id: userId, 
                nombre: req.body.nombre,
                email: req.body.email, 
                img: imgUser,
                alt: altUser,
                rol: parseInt(req.body.rol),
                delete: false
            }
            return usuario 
        }  
        let usuario = acount(userId, req)
        users.forEach(elem=>{
             if (elem.id == userId){
                if(req.session.usuarioLogueado.id == elem.id ) 
               {  elem.nombre = usuario.nombre;
                 elem.img = usuario.img;
                 elem.email = usuario.email; 
                 elem.rol = usuario.rol;
                }else{
                    elem.rol = usuario.rol; 
                }
            }
         });
         fs.writeFileSync(usersJSON, JSON.stringify(users, null, 2))
         return  res.redirect('/users/userDetail/' + userId)
    },
    softDelete: (req, res)=>{
        let id = req.params.id;
        users.forEach(elem=>{
            if(elem.id == id){
                elem.delete=true;
            }
        });
        fs.writeFileSync(usersJSON, JSON.stringify(users, null, 2));
        return res.redirect('/panels/manageUsers/');
    },
    hardDelete: (req, res)=>{
        let id = req.params.id;
        let usersNotDelete = users.filter(row=>{return row.id != id});
        fs.writeFileSync(usersJSON, JSON.stringify(usersNotDelete, null, 2));
        return res.redirect('/panels/manageUsers/');
    },
   
    processActivate: (req, res) => {
        let id = req.params.id;
        users.forEach(elem=>{
            if(elem.id==id){
                elem.delete=false;
            }
        });
        fs.writeFileSync(usersJSON, JSON.stringify(users, null, 2));
        return res.redirect('/panels/manageUsers/');
    },
    logout: (req, res) => {
        res.clearCookie('email')
        req.session.destroy();
        return res.redirect('/')
    }
    

 
}


module.exports = controller;