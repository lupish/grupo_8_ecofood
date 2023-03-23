const { validationResult } = require('express-validator');
const db = require('../database/models');
const sequelize = db.sequelize;
const Categoria = db.Categoria;
const { Op } = require("sequelize");

const controller = {
    create: (req, res) => {
        res.render('categorias/create');
    },
    processCreate: async (req, res) => {
        const t = await sequelize.transaction();
        try {
        // chequeo validaciones middleware
        const valRes = validationResult(req)
        if (valRes.errors.length > 0) {
            return res.render('categorias/create', { errors: valRes.mapped(), oldData: req.body })
        }
        // chequear unicidad
        let repetida = await Categoria.findAll({ where:{
                nombre: req.body.categoria_nombre
        }})
         if (repetida.length > 0) {
            let categoriaRepetida = {
                categoria_nombre: {
                    msg: "La categoría ingresada ya existe"
                }
            }
        return res.render('categorias/create', { errors: categoriaRepetida, oldData: req.body })
        }

        let imagen 
        if (req.file != undefined) {
           imagen = "/img/categorias/" + req.file.filename
        }
        const newCateg = await Categoria.create({
            nombre: req.body.categoria_nombre,
            img: imagen
        },{transaction: t}) 
        await t.commit();
        return  res.redirect("/panels/manageCategorias")       
        } 
        catch (error){
        await t.rollback();
        console.log(error);
        }       
    },
    edit: async (req, res) => {
        const t = await sequelize.transaction();
        try {
        let categoria = await Categoria.findByPk(req.params.id,{transaction: t})
        if (categoria) {
            await t.commit();
            return res.render('categorias/edit', {categoria: categoria})
        } else {
            return  res.redirect("/panels/manageCategorias")
        }
        }
        catch (error){
            await t.rollback();
            console.log(error);
        }
    },
    processEdit: async (req, res) => {
        const t = await sequelize.transaction();
        try {
        // chequeo validaciones middleware
        const valRes = validationResult(req)
        if (valRes.errors.length > 0) {
            const categoriaVieja = await Categoria.findByPk(req.params.id)
            let categoria = {
                id: req.params.id,
                nombre: req.body.categoria_nombre,
                img: categoriaVieja.img
            }
            return res.render('categorias/edit', { errors: valRes.mapped(), categoria: categoria })
        }
        // chequear unicidad
        let repetida = await Categoria.findAll({
            where:{
                id:{
                    [Op.ne]: req.params.id
                },
                nombre: req.body.categoria_nombre
            }
        })
        if(repetida.length > 0){
            let categoriaRepetida = {
                categoria_nombre: {
                    msg: "La categoría ingresada ya existe"
                }
            }
            let categoria = {
                id: req.params.id,
                nombre: req.body.categoria_nombre
            } 
            return res.render('categorias/edit', { errors: categoriaRepetida, categoria: categoria }) 
        }
        
        let id = req.params.id;
        let imagen 
        if (req.file != undefined) {
           imagen = "/img/categorias/" + req.file.filename
        }
        
            const updateCateg = Categoria.update({
            nombre: req.body.categoria_nombre,
            img: imagen
        }, {
            where: {
                id: id
            }
        },{transaction: t})
        await t.commit();
        return  res.redirect("/panels/manageCategorias")
        }
        catch (error){
            await t.rollback();
            console.log(error);
        }  
    },
    softDelete: async (req,res)=>{
        const t = await sequelize.transaction();
        let id = req.params.id;
        try {
            let categoria = await Categoria.destroy({
            where: {
                id: id
            }
        },{transaction: t})
        await t.commit();
        return  res.redirect("/panels/manageCategorias")
        } 
        catch (error){
            await t.rollback();
            console.log(error);
        }   
    },
    hardDelete: async (req,res)=>{
        const t = await sequelize.transaction();
        let id = req.params.id;
        try {
            let categoria = await Categoria.destroy({
                where: {
                    id: id
                }, 
                force: true
            },{transaction: t}) 
            await t.commit();
            return res.redirect("/panels/manageCategorias")
        }
        catch(error){
            await t.rollback();
            console.log(error);
        } 
    },
    processActivate: async (req, res) => {
        const t = await sequelize.transaction();
        let id = req.params.id;
        try {
            let categoria = await Categoria.restore({
                where:{
                    id: id
                }
            },{transaction: t})
            await t.commit();
            return res.redirect("/panels/manageCategorias");
        }
        catch(error){
            await t.rollback();
            console.log(error);
        }
       
    }
}

module.exports = controller;