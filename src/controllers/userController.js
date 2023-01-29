const path = require('path')
const fs = require('fs');
const { check } = require('express-validator');
const { softDelete } = require('./productController');
var validationResult = require('express-validator').validationResult;

//bd users
const usersJSON = path.join(__dirname, '../data/usersDB.json');
let users;
if(usersJSON==""){
users = []
}else {
users = JSON.parse(fs.readFileSync(usersJSON, 'utf-8'))
}

//crar cuenta

function createAcount(userId, req){
    let usuario = {
        id: userId, 
        nombre: req.body.nombre,
        email: req.body.email,
        contrasenia: req.body.contrasenia,
        confirmarContrasenia: req.body.confirmarContrasenia,
        roles: req.body.roles,
        delete: false
 }
 return usuario
}

//controlador
const controller = {
    login: (req, res) => {
        res.render('users/login')
    },
    processLogin: (req, res) => {
        let errors = validationResult(req);
        if(errors.isEmpty()){
            for (let i = 0; i < users.length; i++){
                if (users[1].email == req.body,email){
                    if(bcrypt.compareSync(req.body.contrasenia, users[i].contrasenia)){
                        let usuarioALoguear = users[i];
                        break;
                    }
                }
            }
            if (usuarioALoguear == undefined){
                return req.render('login', {errors: [
                    {msg: 'Credenciales inválidas'}
                ]});
            };
            req.session.usuarioLogueado = usuarioALoguear;
            res.render('/')

        }else{
            return res.render('login', {errors:errors.errors})
        }
    },
    register: (req, res) => {
        res.render('users/register')
    },
    processRegister: (req, res) => {
        let userId = users[users.length-1].id + 1;

        let usuario = createAcount(userId, req)

    //GUARDAR
    users.push(usuario);
    fs.writeFileSync(usersJSON, JSON.stringify(users, null, 2));
    res.redirect('/users/manageUsers')
    },
   
    userDetail: (req, res) => {
        let user = users.find(elem => elem.id == req.params.id && elem.delete==false);
        if (user){
            res.render('users/userDetail', {user:user})
        }else{
            return res.redirect('/products/product-not-found');
        }
    },
    edit: (req, res)=>{
        let user = users.find(elem=>elem.id==req.params.id);
        if (user){
            res.render('users/edit',{user:user})
        }else{
            return res.redirect('/products/product-not-found');
        }
    },
    processEdit: (req, res)=>{
        let userId = users[users.length-1].id + 1;
        let usuario = createAcount(userId, req);
        users.forEach(elem=>{
            if (elem.id == id){
                elem.roles = usuario.roles;
            }
        });
        fs.writeFileSync(usersJSON, JSON.stringify(users, null, 2))
        return  res.redirect('/users/userDetail')
    },
    softDelete: (req, res)=>{
        let id = req.params.id;
    
        users.forEach(elem=>{
            if(elem.id == id){
                elem.delete=true;
            }
        });
        fs.writeFileSync(usersJSON, JSON.stringify(users, null, 2));
        return res.redirect('/users/manageUsers');
    },
    hardDelete: (req, res)=>{
        let id = req.params.id;

        let usersNotDelete = users.filter(row=>{return row.id != id});

        fs.writeFileSync(usersJSON, JSON.stringify(usersNotDelete, null, 2));
        return res.redirect('/users/manageUsers/');
    },
   
    processActivate: (req, res) => {
        let id = req.params.id;
        users.forEach(elem=>{
            if(elem.id=id){
                elem.delete=false;
            }
        });
        fs.writeFileSync(usersJSON, JSON.stringify(users, null, 2));
        return res.redirect('/users/manageUsers/');
    },
    manageUsers: (req, res) => {
        res.render('users/manageUsers', {users: users})
    }
}


module.exports = controller;