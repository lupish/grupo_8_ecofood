const { validationResult } = require('express-validator');
const db = require('../database/models');
const Categoria = db.Categoria;
const { Op } = require("sequelize");

const controller = {
    create: (req, res) => {
        res.render('categorias/create');
    },
    processCreate: async (req, res) => {
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
        try { const newCateg = await Categoria.create({
            nombre: req.body.categoria_nombre,
            img: imagen
        })    
        } 
        catch (error){
        console.log(error);
        }
        return  res.redirect("/panels/manageCategorias")       
    },
    edit: async (req, res) => {
        try {
        let categoria = await Categoria.findByPk(req.params.id)
        if (categoria) {
            res.render('categorias/edit', {categoria: categoria})
        } else {
            return  res.redirect("/panels/manageCategorias")
        }
        }
        catch (error){
            console.log(error);
        }
    },
    processEdit: async (req, res) => {
        // chequeo validaciones middleware
        const valRes = validationResult(req)
        if (valRes.errors.length > 0) {
            let categoria = {
                id: req.params.id,
                nombre: req.body.categoria_nombre
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
        // if (categoriasList.find(elem => elem.nombre == req.body.categoria_nombre && elem.id != req.params.id)) {
        //     let categoriaRepetida = {
        //         categoria_nombre: {
        //             msg: "La categoría ingresada ya existe"
        //         }
        //     }
        //     let categoria = {
        //         id: req.params.id,
        //         nombre: req.body.categoria_nombre
        //     }
        //     return res.render('categorias/edit', { errors: categoriaRepetida, categoria: categoria })
        // }
        //
        let id = req.params.id;
        let imagen 
        if (req.file != undefined) {
           imagen = "/img/categorias/" + req.file.filename
        }
        try {
            const updateCateg = Categoria.update({
            nombre: req.body.categoria_nombre,
            img: imagen
        }, {
            where: {
                id: id
            }
        })}
        catch (error){
            console.log(error);
        }
        return  res.redirect("/panels/manageCategorias")
    },
    softDelete: async (req,res)=>{
        let id = req.params.id;
        try {
            let categoria = await Categoria.destroy({
            where: {
                id: id
            }
        })} 
        catch (error){
            console.log(error);
        }
        return  res.redirect("/panels/manageCategorias")
    },
    hardDelete: async (req,res)=>{
        let id = req.params.id;
        try {
            let categoria = await Categoria.destroy({
                where: {
                    id: id
                }, 
                force: true
            })
        }
        catch(error){
            console.log(error);
        }
        return res.redirect("/panels/manageCategorias")

        // let categoriasNotDelete=categoriasList.filter(row=>{return row.id!=id})

        // fs.writeFileSync(categoriasJSON, JSON.stringify(categoriasNotDelete, null, 2));

        // return  res.redirect("/panels/manageCategorias")
    },
    processActivate: async (req, res) => {
        let id = req.params.id;
        try {
            let categoria = await Categoria.restore({
                where:{
                    id: id
                }
            })
        }
        catch(error){
            console.log(error);
        }
        return res.redirect("/panels/manageCategorias");
        
       
        // categoriasList.forEach(elem => {
        //     if (elem.id == id) {
        //         elem.delete = false;
        //     }
        // });

        // fs.writeFileSync(categoriasJSON, JSON.stringify(categoriasList, null, 2));

        // return  res.redirect("/panels/manageCategorias")
    }
}

module.exports = controller;