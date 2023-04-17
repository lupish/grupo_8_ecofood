const path = require('path')
const fs = require('fs');
const { validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');


// Tablas de la base de datos
const db = require('../database/models');
const sequelize = db.sequelize;
const Usuario = db.Usuario;
const Rol = db.Rol;

//controlador
const controller = {
    login: (req, res) => {
        if (req.session.usuarioLogueado) {
            let id = req.session.usuarioLogueado.id
            return res.redirect('/users/userDetail/' + id );
        }
        res.render('users/login')
    },
    processLogin: async (req, res) => {
        try{
            if (!req.session.usuarioLogueado) {
                let usuario = await Usuario.findOne({
                    where: {email: req.body.email},
                    include: [{association: 'rol'}],
                    paranoid: false})
                
                if (usuario) {
                    if (!bcryptjs.compareSync(req.body.contrasenia, usuario.contrasenia)) {
                        let contraseniaMal = {
                            contrasenia: {
                                msg: "La contraseña no es correcta, si no la recuerda haga clic en Olvidé mi contraseña"
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
        }
        catch (error){
            await t.rollback();
            console.log(error);
        } 
    },
    register: (req, res) => {
        if (req.session.usuarioLogueado) {
            return res.redirect('/')
        }
        res.render('users/register')
    },
    processCreate: async (req, res) => {
        const t = await sequelize.transaction();
        try{
            // CHEQUEAR CAMPOS
            const valRes = validationResult(req)
            if (valRes.errors.length > 0) {
                return res.render('users/register', { errors: valRes.mapped(), oldData: req.body })
            }

            // chequear que usuario no existe
            let usuariosEmail = await Usuario.findAll({where: {email: req.body.email}, paranoid: false})
            if (usuariosEmail.length > 0) {
                let mailRepetido = {
                    email: {
                        msg: "Ya existe un usuario con el mail ingresado"
                    }  
                }
                return res.render('users/register', {errors: mailRepetido, oldData: req.body })
            }

            // chequear que las pass coindicen
            if (req.body.contrasenia == req.body.confirmarContrasenia) {
                //crear usuario
                let userImg; 
                if (req.file != undefined) {
                    userImg = "/img/users/" + req.file.filename;
                }
                let rolesUsuario = await Rol.findAll({where: {nombre: "Usuario"}})
                let userRol = rolesUsuario[0].id
                let user = await Usuario.create(
                    {
                        nombre: req.body.nombre,
                        email: req.body.email,
                        contrasenia: bcryptjs.hashSync(req.body.contrasenia, 10),
                        img: userImg,
                        rol_id: userRol
                    },
                    {transaction: t}
                )
                await t.commit();
                res.redirect('/');
            } else {
                let contraseniaDistinta = {
                    contrasenia: {
                        msg: "La contraseña ingresada no coincide con la confirmación de la misma"
                    }  
                }
                return res.render('users/register', {errors: contraseniaDistinta, oldData: req.body})
            }
        }
        catch (error){
            await t.rollback();
            console.log(error);
        }
    },
    userDetail: async (req, res) => {
        const t = await sequelize.transaction();
        try{
            const user = await Usuario.findOne({
                where: {id: req.params.id}
                ,include: [{association: "rol"}],
                paranoid: false,
                transaction: t
            });
            
            if (user) {
                await t.commit();
                res.render('users/userDetail', {user: user})
            } else {
                return res.redirect('/products/product-not-found');
            }
        }
        catch (error){
            await t.rollback();
            console.log(error);
        }
    },
    edit: async (req, res)=>{
        const t = await sequelize.transaction();
        try{
            const user = await Usuario.findByPk(req.params.id, {paranoid: false},{transaction: t});
            let rolUser;
            if (req.session.usuarioLogueado) {
                rolUser = await Rol.findByPk(req.session.usuarioLogueado.rol_id);
                if (rolUser.nombre != "Administrador" && req.session.usuarioLogueado.id != user.id) {
                    return res.redirect('/products/product-not-found');
                }
            } else {
                return res.redirect('/products/product-not-found');
            }  
            const roles = await Rol.findAll();
            if (user) {
                await t.commit();
                res.render('users/edit', {user: user, rolUser: rolUser.nombre, rol: roles})
            } else {
                return res.redirect('/products/product-not-found');
            }
        }
        catch (error){
            await t.rollback();
            console.log(error);
        }
    }, 
    processEdit: async (req, res) => {
        const t = await sequelize.transaction();
        try{
            let userId = req.params.id;
            let oldUser = await Usuario.findByPk(userId, {paranoid: false});
            

            if (req.session.usuarioLogueado) {
                rolUser = await Rol.findByPk(req.session.usuarioLogueado.rol_id);
            } else {
                return res.redirect('/products/product-not-found');
            }
            const roles = await Rol.findAll();

            const valRes = validationResult(req);
            console.log(valRes)
            if (req.session.usuarioLogueado.id == userId && valRes.errors.length > 0) {
                let userData = oldUser
                userData.nombre =req.body.nombre

                return res.render('users/edit', { errors: valRes.mapped(), user: userData, rolUser: rolUser.nombre, rol: roles })
            }
            
            let userImg; 
            if (req.file != undefined) {
                userImg = "/img/users/" + req.file.filename;
            } else {
                userImg = oldUser.img
            }
            let user = await Usuario.update({
                nombre: req.body.nombre,
                img: userImg,
                rol_id: req.body.rol
            },
            {
                where: {id: userId},
                paranoid: false
            },{transaction: t})
            if (req.session.usuarioLogueado.id == userId) {
                let userEditado = await Usuario.findByPk(userId, {include: [{association: 'rol'}]})
                req.session.usuarioLogueado = userEditado;
            }
            await t.commit();
            return  res.redirect('/users/userDetail/' + userId)
        }
        catch (error){
            await t.rollback();
            console.log(error);
        }
    },
    softDelete: async (req, res)=>{
        const t = await sequelize.transaction();
        try{
            let userId = req.params.id;
            let user = await Usuario.destroy({where: {id: userId}},{transaction: t})
            await t.commit();
            return res.redirect('/panels/manageUsers/');
        }
        catch (error){
            await t.rollback();
            console.log(error);
        }
    },
    processActivate: async (req, res) => {
        const t = await sequelize.transaction();
        try{
            let userId = req.params.id;
            const user = await Usuario.restore({
                where: {id : userId}
            },{transaction: t})
            await t.commit();
            return res.redirect('/panels/manageUsers/');
        }
        catch (error){
            await t.rollback();
            console.log(error);
        }
    },
    logout: async (req, res) => {
        const t = await sequelize.transaction();
        try{
            res.clearCookie('email')
            req.session.destroy();
            await t.commit();
            return res.redirect('/')
        }
        catch (error){
            await t.rollback();
            console.log(error);
        }
    }
}
module.exports = controller;

